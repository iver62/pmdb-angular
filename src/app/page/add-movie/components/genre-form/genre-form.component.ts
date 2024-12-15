
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

  selectedGenres: GenreWrapper[] = [];

  constructor(private formBuilder: FormBuilder) { }

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
    return this.formGroup.get('genresCtrl') as FormArray;
  }

}
