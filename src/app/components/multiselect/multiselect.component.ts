import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Country, Genre } from '../../models';

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
      this.update.emit(EMPTY_STRING);
    }
  }

  updateSearch(event: string) {
    this.update.emit(event);
  }

  onToggleAll(event: boolean) {
    this.control.patchValue(event ? this.items : []);
    this.control.markAsDirty();
  }

  clearSelection() {
    this.control.patchValue([]);
    this.control.markAsDirty();
  }

  compareObjects(o1: Country | Genre, o2: Country | Genre) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
