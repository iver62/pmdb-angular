import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgPipesModule } from 'ngx-pipes';
import { CountryCardComponent } from '../../components';
import { CountryService } from '../../services';

@Component({
  selector: 'app-countries',
  imports: [
    CountryCardComponent,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    NgPipesModule
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {

  countries = toSignal(this.countryService.getAll());

  filteredCountries = computed(() => {
    const term = this.searchTermSignal().toLowerCase();

    // Si le terme de recherche est vide, retourner tous les pays
    if (!term) {
      return this.countries();
    }

    // Sinon, filtrer les pays
    return this.countries().filter(country => country.nomFrFr.toLowerCase().includes(term));
  });

  searchTermSignal = signal('');

  constructor(private countryService: CountryService) { }

  // Getter pour le signal
  get searchTerm(): string {
    return this.searchTermSignal();
  }

  // Setter pour le signal
  set searchTerm(value: string) {
    this.searchTermSignal.set(value);
  }

  // Effacer la recherche
  clearSearch(): void {
    this.searchTermSignal.set('');
  }

}
