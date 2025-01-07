
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Movie } from '../../models';
import { MovieService } from '../../services';
import { GeneralInfosFormComponent, TechnicalSummaryFormComponent } from './components';

@Component({
  selector: 'app-add-movie',
  imports: [
    GeneralInfosFormComponent,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule,
    TechnicalSummaryFormComponent
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {

  private _snackBar = inject(MatSnackBar);
  movie: Movie;
  durationInSeconds = 5;

  form = this.fb.group(
    {
      generalFormGroup: this.fb.group(
        {
          title: ['', Validators.required],
          originalTitle: [],
          synopsis: [],
          releaseDate: [],
          runningTime: [],
          budget: [],
          boxOffice: [],
          poster: [],
          countries: [],
          genres: []
        }
      ),
      technicalSummaryFormGroup: this.fb.group(
        {
          producers: [],
          directors: [],
          screenwriters: [],
          musicians: [],
          decorators: [],
          costumiers: [],
          photographers: [],
          editors: [],
          casting: []
        }
      ),
      castingFormGroup: this.fb.group(
        {

        }
      )
    }
  );

  isLinear = true;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService
  ) { }

  saveMovie() {
    this.movieService.saveMovie(this.form.get('generalFormGroup').value).subscribe(
      {
        next: result => {
          this._snackBar.open('Film créé avec succès', 'Done', { duration: this.durationInSeconds * 1000 });
          this.movie = result;
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de la création du film', 'Error', { duration: this.durationInSeconds * 1000 });
        }
      }
    );
  }

  saveTechnicalSummay() {
    this.movieService.saveTechnicalSummay(this.movie.id, this.form.get('technicalSummaryFormGroup').value).subscribe(
      {
        next: result => {
          this._snackBar.open('Fiche technique ajoutée avec succès', 'Done', { duration: this.durationInSeconds * 1000 });
          this.movie.technicalSummary = result;
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de l\'ajout de la fiche technique', 'Error', { duration: this.durationInSeconds * 1000 });
        }
      }
    );
  }


  deleteMovie() {
    this.movieService.deleteMovie(this.movie.id).subscribe(result => console.log(result));
  }
}
