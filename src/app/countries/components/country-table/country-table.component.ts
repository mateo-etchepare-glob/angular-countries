import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Country } from '../../interfaces/country';
import { LocalStorageService } from 'src/app/shared/utils/storage/local.storage.service';


@Component({
  selector: 'countries-table',
  templateUrl: './country-table.component.html',
  styles: [
    `img {
      width: 25px;
    }`
  ]
})
export class CountryTableComponent {

  constructor(private _localStorageService: LocalStorageService) {

  }

  @Input()
  public countries: Country[] = [];

  @Output() favoriteClicked = new EventEmitter<void>();

  updateStarredList(countryName: string): void {
    const index = this.countries.findIndex(country => country.name.common === countryName);
    this.countries[index].starred = !this.countries[index].starred; // lo saco o lo pongo como starred (esto es para efecto inmediato visual)

    let countriesStorage: string[] = this._localStorageService.getItem('countries') as string[] || [];
    const countryIndex = countriesStorage.indexOf(countryName);

    if (this.countries[index].starred && countryIndex === -1) {
      countriesStorage.push(countryName);
    } else if (!this.countries[index].starred && countryIndex !== -1) {
      countriesStorage.splice(countryIndex, 1);
    }
    this._localStorageService.setItem('countries', countriesStorage);
    this.favoriteClicked.emit();
  }
}
