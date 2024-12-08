
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Genre } from '../../../../models';

interface GenreWrapper {
  id?: number,
  name?: string,
  selected?: boolean
}

@Component({
    selector: 'app-genre-form',
    imports: [CommonModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule, ReactiveFormsModule],
    templateUrl: './genre-form.component.html',
    styleUrl: './genre-form.component.css'
})
export class GenreFormComponent {

  @Input() formGroup: FormGroup;

  @Output() remove = new EventEmitter<Genre>();

  // genres$ = this.genreService.getAll().pipe(
  //   map(
  //     genres => genres.map(
  //       g => (
  //         {
  //           ...g,
  //           selected: false
  //         }
  //       )
  //     )
  //   )
  // );

  selectedGenres: GenreWrapper[] = [];

  constructor(private formBuilder: FormBuilder) { }

  displayFn(value: Genre[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((genre, index) => {
        if (index === 0) {
          displayValue = genre.name;
        } else {
          displayValue += ', ' + genre.name;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  optionClicked(event: Event, genre: GenreWrapper) {
    event.stopPropagation();
    this.toggleSelection(genre);
  }

  toggleSelection(genre: GenreWrapper) {
    genre.selected = !genre.selected;
    if (genre.selected) {
      this.selectedGenres.push(genre);
    } else {
      const i = this.selectedGenres.findIndex(value => value.name === genre.name);
      this.selectedGenres.splice(i, 1);
    }

    this.formGroup.controls['genresCtrl'].setValue(this.selectedGenres);
    console.log(this.formGroup.controls['genresCtrl']);

  }

  addGenre() {
    const item = this.formBuilder.group(
      {
        name: ['']
      }
    );
    this.genresArray.push(item);
  }

  removeGenre(index: number) {
    this.genresArray.removeAt(index);
    this.remove.emit(this.genresArray.at(index).value);
  }

  get genresArray() {
    return this.formGroup.get('genresCtrl') as FormArray
      ;
  }

}
