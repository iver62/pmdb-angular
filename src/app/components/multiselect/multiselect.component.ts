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
  @Input() items: Country[] | Genre[]
  @Input() control: FormControl;

  @Output() update = new EventEmitter<string>();

  updateSearch(event: string) {
    this.update.emit(event);
  }
}
