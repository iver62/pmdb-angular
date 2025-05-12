
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of, switchMap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { Award, Movie, MovieActor } from '../../models';
import { AuthService, MovieService } from '../../services';
import { AwardsFormComponent, CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from './components';
import { DEFAULT_CURRENCY } from '../../utils';

@Component({
  selector: 'app-add-movie',
  imports: [
    AwardsFormComponent,
    CastingFormComponent,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    TechnicalTeamFormComponent,
    TranslatePipe
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.scss'
})
export class AddMovieComponent {

  @ViewChild('stepper') stepper!: MatStepper;

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
      budgetCurrency: [DEFAULT_CURRENCY],
      boxOffice: [],
      boxOfficeCurrency: [DEFAULT_CURRENCY],
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
  awardsForm = this.fb.group(
    {
      awards: this.fb.array<Award>([])
    }
  );

  isLinear = true;
  currentStep = 0;

  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private fb: FormBuilder,
    private movieService: MovieService
  ) { }

  onStepChange(event: StepperSelectionEvent) {
    this.currentStep = event.selectedIndex;
  }

  selectImage(event: any) {
    this.imageFile = event;
  }

  saveMovie() {
    if (this.generalInfosForm.valid) {
      this.authService.loadUserProfile().pipe(
        switchMap(user => this.movieService.saveMovie(this.imageFile, { ...this.generalInfosForm.value, user: user })
          .pipe(
            catchError(response => {
              console.error('Erreur lors de la création du film.', response.error);
              this._snackBar.open(`Erreur lors de la création du film. ${response.error}`, 'Error', { duration: this.duration });
              return of(null);
            })
          )
        )
      ).subscribe(result => {
        if (result) {
          this._snackBar.open('Film créé avec succès', 'Done', { duration: this.duration });
          this.stepper.next();
          this.movie = result;
        }
      });
    } else {
      this._snackBar.open('Le formulaire est invalide', 'Error', { duration: this.duration });
    }
  }

  saveTechnicalTeam() {
    if (this.technicalTeamForm.valid) {
      this.movieService.saveTechnicalTeam(this.movie.id, this.technicalTeamForm.value).pipe(
        catchError(error => {
          console.error(error);
          this._snackBar.open('Erreur lors de l\'ajout de la fiche technique', 'Error', { duration: this.duration });
          return of(null);
        })
      ).subscribe(result => {
        if (result) {
          this._snackBar.open('Fiche technique ajoutée avec succès', 'Done', { duration: this.duration });
          this.stepper.next();
          this.movie.technicalTeam = result;
        }
      });
    } else {
      this._snackBar.open('Le formulaire est invalide', 'Error', { duration: this.duration });
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
            this.stepper.next();
            this.movie.movieActors = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout du casting', 'Error', { duration: this.duration });
          }
        }
      )
    } else {
      this._snackBar.open('Le formulaire est invalide', 'Error', { duration: this.duration });
    }
  }

  saveAwards() {
    if (this.awardsForm.valid) {
      this.movieService.saveAwards(this.movie.id, this.awardsForm.value['awards']).subscribe(
        {
          next: result => {
            this._snackBar.open('Récompenses ajoutées avec succès', 'Done', { duration: this.duration });
            this.stepper.next();
            this.movie.awards = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des récompenses', 'Error', { duration: this.duration });
          }
        }
      )
    } else {
      this._snackBar.open('Le formulaire est invalide', 'Error', { duration: this.duration });
    }
    if (this.awardsForm.valid) {
    } else {
      this._snackBar.open('Le formulaire est invalide', 'Error', { duration: this.duration });
    }
  }
}
