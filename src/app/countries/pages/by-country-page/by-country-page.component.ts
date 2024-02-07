import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';
import { LocalStorageService } from 'src/app/shared/utils/storage/local.storage.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: [
  ]
})
export class ByCountryPageComponent implements OnInit {

  public countries: Country[] = [];
  public initialValue: string = '';

  constructor( private countriesService: CountriesService, private _localStorageService: LocalStorageService ) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCountries.countries;
    this.initialValue = this.countriesService.cacheStore.byCountries.term;
    if (this.initialValue !== null) {
      this.countries = this.countriesService.didFavoritesChanged(this.countries);
    }
  }

  searchByCountry( term: string ):void  {
    this.initialValue = term;
    this.countriesService.searchCountry( term )
      .subscribe( countries => {
        this.countries = countries;
      });
  }

}
