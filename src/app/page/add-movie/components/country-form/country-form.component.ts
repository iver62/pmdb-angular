
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { CountryService } from '../../../../services';

@Component({
    selector: 'app-country-form',
    imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule, NgPipesModule, ReactiveFormsModule],
    templateUrl: './country-form.component.html',
    styleUrl: './country-form.component.css'
})
export class CountryFormComponent {

  @Input() formGroup: FormGroup;

  // @Output() remove = new EventEmitter<Country>();

  countries$ = this.countryService.getAll();

  constructor(private countryService: CountryService) { }

  // addCountry() {
  //   const item = this.formBuilder.group(
  //     {
  //       name: ['']
  //     }
  //   );
  //   this.countriesArray.push(item);
  // }

  // removeCountry(index: number) {
  //   this.countriesArray.removeAt(index);
  //   this.remove.emit(this.countriesArray.at(index).value);
  // }

  // get countriesArray() {
  //   return this.formGroup.get('countriesCtrl') as FormArray;
  // }

}
