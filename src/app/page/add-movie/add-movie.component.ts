
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
    ReactiveFormsModule,
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
  imageFile: File | null = null;

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
          posterFileName: [],
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
          casters: [],
          artDirectors: [],
          soundEditors: [],
          visualEffectsSupervisors: [],
          makeupArtists: [],
          hairDressers: []
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

  // get formValue() {
  //   return this.form.get('generalFormGroup').value;
  // }

  selectImage(event: any) {
    this.imageFile = event;
  }

  saveMovie() {
    this.movieService.saveMovie(this.imageFile, this.form.get('generalFormGroup').value).subscribe(
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

  saveTechnicalSummary() {
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
}
