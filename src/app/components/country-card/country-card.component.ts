import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Country } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-country-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.css'
})
export class CountryCardComponent {

  country = input.required<Country>();

}
