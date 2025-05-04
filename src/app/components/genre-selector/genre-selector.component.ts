import { ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, catchError, distinctUntilChanged, filter, map, of, switchMap, take, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Genre } from '../../models';
import { GenreService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-genre-selector',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './genre-selector.component.html',
  styleUrl: './genre-selector.component.css'
})
export class GenreSelectorComponent {

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  formGroupName = input.required<string>();
  searchTerm$ = new BehaviorSubject(EMPTY_STRING);
  selectedGenres = signal<Genre[]>([]);

  readonly filteredGenres$ = this.searchTerm$.pipe(
    distinctUntilChanged((t1, t2) => t1 == t2),
    switchMap(term => this.genreService.getAll(term)
      .pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => response.body ?? []),
        map(genres =>
          genres
            .filter(genre => !this.selectedGenres().some(g => g.id === genre.id))
            .map(g => new Genre(g))
        ),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  readonly separatorKeysCodes: number[] = [ENTER];

  control: FormControl<Genre[]>;
  total: number;

  constructor(
    private genreService: GenreService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => {
      this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl;
      this.selectedGenres.set(this.control.value || []);
    });
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || EMPTY_STRING).trim();

    this.filteredGenres$.pipe(
      filter(() => value != EMPTY_STRING),
      take(1)
    ).subscribe(genres => {
      if (value) {
        // Si l'input ne correspond à aucun genre existant
        if (!genres.map(g => g.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
          this.genreService.save({ name: value }).subscribe(result => {
            this.selectedGenres().push(result);
            this.control.setValue(this.selectedGenres());
          });
        } else {
          this.selectedGenres().push(genres.find(g => g.name.toLocaleLowerCase() == value.toLocaleLowerCase()));
          this.control.setValue(this.selectedGenres());
        }
      }

      // Clear the input value
      this.searchTerm$.next(EMPTY_STRING);
      this.input.nativeElement.value = EMPTY_STRING;
    });
  }

  remove(genre: Genre) {
    const index = this.selectedGenres().findIndex(g => g.id === genre.id);

    if (index >= 0) {
      this.selectedGenres.update(genres => genres.filter(g => g.id !== genre.id));
      this.control.setValue([...this.selectedGenres()]);
      this.searchTerm$.next(EMPTY_STRING);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const genre: Genre = event.option.value;

    if (!this.selectedGenres().some(g => g.id === genre.id)) {
      this.selectedGenres().push(genre);
      this.control.setValue(this.selectedGenres());

      if (this.input) {
        this.input.nativeElement.value = EMPTY_STRING; // Clear the input value
      }
    }
  }

}
