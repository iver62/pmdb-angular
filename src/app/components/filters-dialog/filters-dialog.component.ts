import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
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
  searchCountryTerm = new BehaviorSubject(EMPTY_STRING);
  searchGenreTerm = new BehaviorSubject(EMPTY_STRING);

  // Liste des genres filtrés
  genres$ = this.searchGenreTerm.pipe(
    switchMap(term => this.genreService.getAll(term)
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
      fromReleaseDate: new FormControl<Date | null>(null),
      toReleaseDate: new FormControl<Date | null>(null),
      fromBirthDate: new FormControl<Date | null>(null),
      toBirthDate: new FormControl<Date | null>(null),
      fromDeathDate: new FormControl<Date | null>(null),
      toDeathDate: new FormControl<Date | null>(null),
      genres: new FormControl<number[]>(null),
      countries: new FormControl<number[]>(null),
      fromCreationDate: new FormControl<Date | null>(null),
      toCreationDate: new FormControl<Date | null>(null),
      fromLastUpdate: new FormControl<Date | null>(null),
      toLastUpdate: new FormControl<Date | null>(null)
    }
  );

  constructor(
    private countryService: CountryService,
    private genreService: GenreService,
    @Inject(MAT_DIALOG_DATA) public data: string[]
  ) { }

  // Fonction pour mettre à jour la recherche
  updateCountrySearch(term: string) {
    this.searchCountryTerm.next(term);
  }

  // Fonction pour mettre à jour la recherche
  updateGenreSearch(term: string) {
    this.searchGenreTerm.next(term);
  }
}
