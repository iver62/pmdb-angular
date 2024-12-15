import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Movie } from '../../../../../models';

@Component({
  selector: 'app-general-infos',
  imports: [MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './general-infos.component.html',
  styleUrl: './general-infos.component.css'
})
export class GeneralInfosComponent {

  movie = input.required<Movie>();

  generalInfosForm: FormGroup;

  @Output() save = new EventEmitter<Movie>();

  constructor(private fb: FormBuilder) {
    effect(() => {
      this.generalInfosForm = this.fb.group(
        {
          titleCtrl: [this.movie().title, Validators.required],
          originalTitleCtrl: [this.movie().originalTitle],
          synopsisCtrl: [this.movie().synopsis],
          releaseDateCtrl: [this.movie().releaseDate],
          runningTimeCtrl: [this.movie().runningTime],
          budgetCtrl: [this.movie().budget],
          boxOfficeCtrl: [this.movie().boxOffice],
          posterCtrl: [this.movie().posterPath],
          genresCtrl: this.fb.array(this.movie().genres),
          countriesCtrl: this.fb.array(this.movie().countries)
        }
      )
    })
  }

  onSubmit(event: any) {
    console.log(event);
    this.save.emit(event);

  }

}
