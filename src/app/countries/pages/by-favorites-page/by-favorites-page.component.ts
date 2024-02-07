import { Component } from '@angular/core';
import { Country } from 'src/app/countries/interfaces/country';
import { CountriesService } from 'src/app/countries/services/countries.service';
import { LocalStorageService } from 'src/app/shared/utils/storage/local.storage.service';

@Component({
  selector: 'app-by-favorites-page',
  templateUrl: './by-favorites-page.html',
})

export class ByFavoritesPageComponent {

  public countries: Country[] = [];
  public initialValue: string = '';

  constructor(private countriesService: CountriesService, private _localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.searchAll();
  }

  showAllFavorites() {
    const favCountries = this._localStorageService.getItem('countries') as String[];
    this.countries = this.countries.filter(country => favCountries.includes(country.name.common));
  }

  searchCountry(term: string) { // para buscar entre los favoritos
    if (term == '') {
      this.searchAll()
    } else {
      this.countriesService.searchCountry(term)
        .subscribe(countries => {
          this.countries = countries;
          this.showAllFavorites();
        });
    }
  }

  searchAll(): void {
    this.countriesService.searchAll()
      .subscribe(countries => {
        this.countries = countries;
        this.showAllFavorites();
      });
  }

  favoriteClicked() {
    this.searchAll(); // Realiza la búsqueda de todos los favoritos nuevamente
  }
}
