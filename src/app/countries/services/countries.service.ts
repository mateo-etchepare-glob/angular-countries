import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map, tap, count } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';
import { LocalStorageService } from 'src/app/shared/utils/storage/local.storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environment/environment';

@Injectable({ providedIn: 'root' })
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital:   { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion:    { region: '', countries: [] },
  }

  public google_api_key = environment.GOOGLE_API_KEY;

  constructor(private http: HttpClient, private _localStorageService: LocalStorageService, private sanitizer: DomSanitizer, ) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    this._localStorageService.setItem( 'cacheStore', this.cacheStore);
  }

  private loadFromLocalStorage() {
    if ( !this._localStorageService.getItem('cacheStore') ) return;

    this.cacheStore = this._localStorageService.getItem('cacheStore') as CacheStore;
  }

  private getCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) ),
      );
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {
    const url = `${ this.apiUrl }/alpha/${ code }`;
    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ),
        catchError( () => of(null) )
      );
  }


  searchCapital( term: string ): Observable<Country[]> {
    const url = `${ this.apiUrl }/capital/${ term }`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => {
        countries.forEach(country => {
          country.starred = this.isStarred(country.name.common); // marco como favoritos los países antes de guardarlos
        });
        this.cacheStore.byCapital = { term, countries };
        console.log(this.cacheStore.byCountries)
        this.saveToLocalStorage();
      })
    );
  }

  searchCountry( term: string ): Observable<Country[]> {

    const url = `${ this.apiUrl }/name/${ term }`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => {
        countries.forEach(country => {
          country.starred = this.isStarred(country.name.common); // marco como favoritos los países antes de guardarlos
        });
        this.cacheStore.byCountries = { term, countries };
        this.saveToLocalStorage();
      })
    );
  }

  isStarred(countryName: string): boolean {
    const starredCountries = this._localStorageService.getItem('countries') as String[]; // están guardadas como String en 
    // country-table.components.ts ya que ahí es donde
    // se clickea la estrella y de esta forma se ahorra espacio en storage

    if (starredCountries == null) {
      return false
    }
    return starredCountries.includes(countryName);
  }

  didFavoritesChange(countries: Country[]): Country[] {
    countries.forEach(country => country.starred = this.isStarred(country.name.common));
    return countries;
  }

  searchAll(): Observable<Country[]> {
      const url = `${ this.apiUrl }/all`;
      return this.getCountriesRequest(url)
      .pipe(
        tap(countries => {
          countries.forEach(country => {
            country.starred = this.isStarred(country.name.common); // marco como favoritos los países antes de guardarlos
          });
          this.saveToLocalStorage();
        })
      );
    }


  searchRegion( region: Region ): Observable<Country[]> {
    const url = `${ this.apiUrl }/region/${ region }`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => {
        countries.forEach(country => {
          country.starred = this.isStarred(country.name.common); 
        });
        this.cacheStore.byRegion = { region, countries };
        this.saveToLocalStorage();
      })
    );
  }

  updateGoogleEmbedUrl(country: Country): SafeResourceUrl {
      const google_embed_api_url = `https://www.google.com/maps/embed/v1/place?key=${this.google_api_key}&q=+&center=${country.latlng[0]},${country.latlng[1]}&zoom=4.5`;
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(google_embed_api_url); // marco que el URL 
      return safeUrl;
  }
}

