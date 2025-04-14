import { Component, input } from '@angular/core';
import { CountryCardComponent } from '..';
import { Country } from '../../models';

@Component({
  selector: 'app-countries-list',
  imports: [CountryCardComponent],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.css'
})
export class CountriesListComponent {

  countries = input.required<Country[]>();

}
