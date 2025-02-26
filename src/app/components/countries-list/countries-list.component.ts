import { Component, input } from '@angular/core';
import { Country } from '../../models';
import { CountryCardComponent } from '../country-card/country-card.component';

@Component({
  selector: 'app-countries-list',
  imports: [CountryCardComponent],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.css'
})
export class CountriesListComponent {

  countries = input.required<Country[]>();

}
