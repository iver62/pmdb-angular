import { ENTER } from '@angular/cdk/keycodes';
import { Component, computed, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgPipesModule } from 'ngx-pipes';
import { Genre } from '../../models';
import { GenreService } from '../../services';

@Component({
  selector: 'app-genre-selector',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './genre-selector.component.html',
  styleUrl: './genre-selector.component.css'
})
export class GenreSelectorComponent {

  @Input() formGroupName: string;

  @Output() addGenre = new EventEmitter<Genre>();

  genres = input.required<Genre[]>();

  genresSignal = signal<Genre[]>(null);
  selectedGenres = signal<Genre[]>([]);
  currentGenre = signal<string>('');

  readonly filteredGenres = computed(() =>
    this.genresSignal()
      ?.filter(genre => !this.selectedGenres().some(g => g.id === genre.id))
      ?.filter(genre => genre.name.toLowerCase().includes(this.currentGenre()?.toLowerCase()))
  );

  control: FormControl;

  readonly separatorKeysCodes: number[] = [ENTER];

  constructor(
    private genreService: GenreService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => this.genresSignal.set(this.genres()));
  }

  ngOnInit() {
    this.control = this.rootFormGroup.control.get(this.formGroupName) as FormControl;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.genresSignal().map(g => g.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
      this.genreService.save({ name: value }).subscribe(result => {
        // this.genresSignal.update(genres => [...genres, result]);
        this.addGenre.emit(result);
        this.selectedGenres().push(result);
        this.control.setValue(this.selectedGenres);
      });
    }

    // Add our keyword
    if (value && this.genresSignal().map(g => g.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
      this.selectedGenres().push(this.genresSignal().find(g => g.name.toLocaleLowerCase() == value.toLocaleLowerCase()));
      this.control.setValue(this.selectedGenres);
    }

    // Clear the input value
    // this.genreCtrl.setValue('');
    this.currentGenre.set('');
  }

  remove(genre: Genre) {
    const index = this.selectedGenres().findIndex(g => g.id === genre.id);
    if (index >= 0) {
      this.selectedGenres.update(genres => genres.filter(g => g.id !== genre.id));
      this.control.setValue(this.selectedGenres);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const genre: Genre = event.option.value;

    if (!this.selectedGenres().some(g => g.id === genre.id)) {
      this.selectedGenres().push(genre);
      this.control.setValue(this.selectedGenres);
      this.currentGenre.set('');
    }
  }

}
