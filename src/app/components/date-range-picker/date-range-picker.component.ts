import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-date-range-picker',
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css'
})
export class DateRangePickerComponent {

  @Input() label: string;
  @Input() startDatePlaceholder: string;
  @Input() endDatePlaceholder: string;
  @Input() startDateControl: FormControl;
  @Input() endDateControl: FormControl;
}
