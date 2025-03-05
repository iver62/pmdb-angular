import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DelayedInputDirective } from '../../directives';
import { Country, Genre } from '../../models';

@Component({
  selector: 'app-multiselect',
  imports: [
    DelayedInputDirective,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.css'
})
export class MultiselectComponent {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() placeholderLabel: string;
  @Input() noEntriesFoundLabel: string;
  @Input() items: Country[] | Genre[];
  @Input() control: FormControl;

  @Output() update = new EventEmitter<string>();

  openedChange(event: boolean) {
    if (event) {
      this.update.emit('');
    }
  }

  updateSearch(event: string) {
    this.update.emit(event);
  }

  onToggleAll(event: boolean) {
    this.control.patchValue(event ? this.items.map(i => i.id) : []);
  }

  compareObjects(o1: Country | Genre, o2: Country | Genre) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
