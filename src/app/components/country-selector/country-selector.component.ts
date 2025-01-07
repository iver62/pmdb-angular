import { ENTER } from '@angular/cdk/keycodes';
import { Component, computed, Input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgPipesModule } from 'ngx-pipes';
import { Country } from '../../models';
import { CountryService } from '../../services';

@Component({
  selector: 'app-country-selector',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.css'
})
export class CountrySelectorComponent {

  @Input() formGroupName: string;

  readonly separatorKeysCodes: number[] = [ENTER];

  countries = toSignal(this.countryService.getAll());
  selectedCountries = signal<Country[]>([]);
  currentCountry = signal<string>('');

  readonly filteredCountries = computed(() => this.countries()
    ?.filter(country => !this.selectedCountries().some(c => c.id === country.id))
    ?.filter(country => country.nomFrFr.toLowerCase().includes(this.currentCountry()?.toLowerCase()))
  );

  control: FormControl;

  constructor(
    private countryService: CountryService,
    private rootFormGroup: FormGroupDirective
  ) { }

  ngOnInit() {
    this.control = this.rootFormGroup.control.get(this.formGroupName) as FormControl;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value && this.countries().map(country => country.nomFrFr).includes(value)) {
      this.control.setValue(this.selectedCountries);
    }

    // Clear the input value
    this.currentCountry.set('');
  }

  remove(country: Country) {
    const index = this.selectedCountries().findIndex(c => c.id === country.id);
    if (index >= 0) {
      this.selectedCountries().splice(index, 1);
      this.control.setValue(this.selectedCountries);
      // this.announcer.announce(`Utilisateur ${user.firstName} ${user.lastName} supprimé`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const country: Country = event.option.value;

    if (!this.selectedCountries().some(c => c.id === country.id)) {
      this.selectedCountries().push(country);
      this.control.setValue(this.selectedCountries);
      this.currentCountry.set('');
    }
  }

}
