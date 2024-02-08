import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { count, switchMap } from 'rxjs';
import { Country } from '../../interfaces/country';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit {

  public country?: Country;
  public google_api_key: string = "AIzaSyBjSmR1Sx00VJYkGqws7-yauKCe2CskG44"
  public google_embed_api_url:string = ''
  public safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countriesService: CountriesService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.countriesService.searchCountryByAlphaCode( id )),
      )
      .subscribe( country => {
        if ( !country ) return this.router.navigateByUrl('');
        this.country = country;
        this.updateGoogleEmbedUrl();
        return;
      });
  }

  private updateGoogleEmbedUrl(): void {
    if (this.country && this.country.latlng) {
      this.google_embed_api_url = `https://www.google.com/maps/embed/v1/place?key=${this.google_api_key}&q=+&center=${this.country.latlng[0].toPrecision(6)},${this.country.latlng[1].toPrecision(6)}&zoom=4.5`;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.google_embed_api_url);
    }
  }
}