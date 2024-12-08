import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CountryService } from '../../services/country.service';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-countries',
    imports: [CommonModule, MatCardModule, NgPipesModule],
    templateUrl: './countries.component.html',
    styleUrl: './countries.component.css'
})
export class CountriesComponent {

  countries$ = this.countryService.getAll();

  constructor(private countryService: CountryService) { }

}
