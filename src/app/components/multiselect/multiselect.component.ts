import { Component, computed, effect, EventEmitter, input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Country, Genre, User } from '../../models';

@Component({
  selector: 'app-multiselect',
  imports: [
    DelayedInputDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.scss'
})
export class MultiselectComponent {

  label = input.required<string>();
  placeholder = input.required<string>();
  placeholderLabel = input.required<string>();
  noEntriesFoundLabel = input.required<string>();
  items = input.required<Country[] | Genre[] | User[]>();
  control = input.required<FormControl>();

  @Output() update = new EventEmitter<string>();

  // Signal pour stocker les valeurs du multiselect
  selectedValues = signal<(Country | Genre | User)[]>([]);

  checkboxChecked = computed(() => this.selectedValues()?.length > 0 && this.selectedValues()?.length === this.items()?.length);
  checkboxIndeterminate = computed(() => !this.checkboxChecked() && this.selectedValues()?.length > 0);

  constructor() {
    effect(() => this.selectedValues.set(this.control().value || []));
  }

  selectionChange(event: MatSelectChange) {
    this.selectedValues.set(event.value);
  }

  openedChange(event: boolean) {
    if (event) {
      this.update.emit(EMPTY_STRING);
    }
  }

  updateSearch(event: string) {
    this.update.emit(event);
  }

  onToggleAll(event: boolean) {
    this.selectedValues.set(event ? this.items() : [])
    this.control().patchValue(event ? this.items() : []);
    this.control().markAsDirty();
  }

  clearSelection() {
    this.selectedValues.set([])
    this.control().patchValue([]);
    this.control().markAsDirty();
  }

  eraseSearch() {
    this.update.emit(EMPTY_STRING)
  }

  compareObjects(o1: Country | Genre, o2: Country | Genre) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
