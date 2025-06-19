
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, of, switchMap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { Award, Movie, MovieActor, MovieTechnician, TechnicalTeam, User } from '../../models';
import { AuthService, MovieService } from '../../services';
import { AwardsFormComponent, CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from './components';

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
      budgetCurrency: [],
      boxOffice: [],
      boxOfficeCurrency: [],
      posterFileName: [],
      countries: [],
      categories: []
    }
  );

  technicalTeam: TechnicalTeam = {
    producers: [],
    directors: [],
    assistantDirectors: [],
    screenwriters: [],
    composers: [],
    musicians: [],
    photographers: [],
    costumiers: [],
    decorators: [],
    editors: [],
    casters: [],
    artists: [],
    soundEditors: [],
    vfxSupervisors: [],
    sfxSupervisors: [],
    makeupArtists: [],
    hairDressers: [],
    stuntmen: []
  }

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
    private authService: AuthService,
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
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
        switchMap(user => this.movieService.saveMovie(this.imageFile, this.movieService.buildMovieFromForm(this.generalInfosForm, user))
          .pipe(
            catchError(response => {
              console.error('Erreur lors de la création du film.', response.error);
              this.snackBar.open(this.translate.instant('app.error_creating_movie'), this.translate.instant('app.close'), { duration: this.duration });
              return of(null);
            })
          )
        )
      ).subscribe(result => {
        if (result) {
          this.snackBar.open(this.translate.instant('app.movie_created_success'), this.translate.instant('app.close'), { duration: this.duration });
          this.stepper.next();
          this.movie = result;
        }
      });
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
  }

  updateTechnicians(event: { type: keyof TechnicalTeam, list: MovieTechnician[] }) {
    this.movie.technicalTeam[event.type] = event.list;
  }

  saveCasting() {
    if (this.castingForm.valid) {
      const body: MovieActor[] = this.castingForm.get('actors').value.map(
        (ma: any, index: number) => (
          {
            person: { id: ma.id, name: ma.name },
            role: ma.role,
            rank: index
          }
        )
      );

      this.movieService.saveCast(this.movie.id, body).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.cast_added_success'), this.translate.instant('app.close'), { duration: this.duration });
            this.stepper.next();
            this.movie.movieActors = result;
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.error_adding_cast'), this.translate.instant('app.close'), { duration: this.duration });
          }
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
  }

  saveAwards() {
    if (this.awardsForm.valid) {
      this.movieService.saveAwards(this.movie.id, this.awardsForm.value['awards']).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.awards_added_success'), this.translate.instant('app.close'), { duration: this.duration });
            this.stepper.next();
            this.movie.awards = result;
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('error_adding_awards'), this.translate.instant('app.close'), { duration: this.duration });
          }
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
  }
}
