import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import { Country, Genre } from '../../models';
import { CountryService, GenreService } from '../../services';
import { DateRangePickerComponent } from "../date-range-picker/date-range-picker.component";
import { MultiselectComponent } from '../multiselect/multiselect.component';

@Component({
  selector: 'app-filters-dialog',
  imports: [
    AsyncPipe,
    DateRangePickerComponent,
    MatButtonModule,
    MatDialogModule,
    MultiselectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.css'
})
export class FiltersDialogComponent {

  // Termes de recherche
  searchCountryTerm = new BehaviorSubject('');
  searchGenreTerm = new BehaviorSubject('');

  // Liste des genres filtrés
  genres$ = this.searchGenreTerm.pipe(
    switchMap(term => this.genreService.getGenres(term)
      .pipe(
        map(genres => genres.map(g => new Genre(g))),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  // Liste des pays filtrés
  countries$ = this.searchCountryTerm.pipe(
    switchMap(term => this.countryService.getAll(term)
      .pipe(
        map(countries => countries.map(c => new Country(c))),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  readonly form = new FormGroup(
    {
      startReleaseDate: new FormControl<Date | null>(null),
      endReleaseDate: new FormControl<Date | null>(null),
      minRunningTime: new FormControl<number | null>(0),
      maxRunningTime: new FormControl<number | null>(300),
      minBudget: new FormControl<number | null>(0),
      maxBudget: new FormControl<number | null>(1000000000),
      minBoxOffice: new FormControl<number | null>(0),
      maxBoxOffice: new FormControl<number | null>(1000000000),
      genres: new FormControl<number[]>(null),
      countries: new FormControl<number[]>(null),
      startCreationDate: new FormControl<Date | null>(null),
      endCreationDate: new FormControl<Date | null>(null),
      startLastUpdate: new FormControl<Date | null>(null),
      endLastUpdate: new FormControl<Date | null>(null)
    }
  );

  constructor(
    private countryService: CountryService,
    private genreService: GenreService
  ) { }

  // Fonction pour mettre à jour la recherche
  updateCountrySearch(term: string) {
    this.searchCountryTerm.next(term);
  }

  // Fonction pour mettre à jour la recherche
  updateGenreSearch(term: string) {
    this.searchGenreTerm.next(term);
  }

  formatLabel(value: number) {
    if (value >= 1000 && value < 1000000) {
      return Math.round(value / 1000) + 'k';
    } else if (value >= 1000000 && value < 1000000000) {
      return Math.round(value / 1000000) + 'M';
    } else if (value >= 1000000000) {
      return Math.round(value / 1000000000) + 'G';
    }
    return `${value}`;
  }
}
