
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { EMPTY_STRING } from '../../app.component';
import { Movie, MovieActor } from '../../models';
import { MovieService } from '../../services';
import { CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from './components';

@Component({
  selector: 'app-add-movie',
  imports: [
    CastingFormComponent,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    TechnicalTeamFormComponent,
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {

  movie: Movie;
  duration = 5000;
  imageFile: File | null = null;

  generalInfosForm = this.fb.group(
    {
      title: [EMPTY_STRING, Validators.required],
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
  );
  technicalTeamForm = this.fb.group(
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
      hairDressers: [],
      stuntmen: []
    }
  );
  castingForm = this.fb.group(
    {
      actors: this.fb.array<MovieActor>([])
    }
  );

  isLinear = true;

  constructor(
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private movieService: MovieService
  ) { }

  selectImage(event: any) {
    this.imageFile = event;
  }

  saveMovie() {
    if (this.generalInfosForm.valid) {
      this.movieService.saveMovie(this.imageFile, this.generalInfosForm.value).subscribe(
        {
          next: result => {
            this._snackBar.open('Film créé avec succès', 'Done', { duration: this.duration });
            this.movie = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la création du film', 'Error', { duration: this.duration });
          }
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  saveTechnicalTeam() {
    if (this.technicalTeamForm.valid) {
      this.movieService.saveTechnicalTeam(this.movie.id, this.technicalTeamForm.value).subscribe(
        {
          next: result => {
            this._snackBar.open('Fiche technique ajoutée avec succès', 'Done', { duration: this.duration });
            this.movie.technicalTeam = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout de la fiche technique', 'Error', { duration: this.duration });
          }
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  saveCasting() {
    if (this.castingForm.valid) {
      const body: MovieActor[] = this.castingForm.get('actors').value.map(
        (ma: any, index: number) => (
          {
            actor: { id: ma.id, name: ma.name },
            role: ma.role,
            rank: index
          }
        )
      );

      this.movieService.saveCasting(this.movie.id, body).subscribe(
        {
          next: result => {
            this._snackBar.open('Casting ajouté avec succès', 'Done', { duration: this.duration });
            this.movie.movieActors = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la modification du casting', 'Error', { duration: this.duration });
          }
        }
      )
    } else {
      console.error('Le formulaire est invalide');
    }
  }
}
