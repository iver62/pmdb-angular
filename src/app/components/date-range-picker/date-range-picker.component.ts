import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-date-range-picker',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss'
})
export class DateRangePickerComponent {

  @Input() label: string;
  @Input() fromDatePlaceholder: string;
  @Input() toDatePlaceholder: string;
  @Input() fromDateControl: FormControl;
  @Input() toDateControl: FormControl;

  clearDates() {
    this.fromDateControl.reset();
    this.toDateControl.reset();
    this.fromDateControl.markAsDirty();
  }

}
