
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { DURATION } from '../../app.component';
import { Award, Movie, MovieActor, MovieTechnician, TechnicalTeam } from '../../models';
import { AuthService, MovieService } from '../../services';
import { AwardsFormComponent, CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from './components';

@Component({
  selector: 'app-add-movie',
  imports: [
    AsyncPipe,
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

  user$ = this.authService.loadUserProfile().pipe(
    catchError(response => {
      console.error('Erreur lors de la récupération de l\'utilisateur.', response.error);
      this.snackBar.open(this.translate.instant('app.error_creating_movie'), this.translate.instant('app.close'), { duration: DURATION });
      return of(null);
    })
  );
  movie: Movie = {};

  technicalTeam: TechnicalTeam = {
    producers: [],
    directors: [],
    assistantDirectors: [],
    screenwriters: [],
    composers: [],
    musicians: [],
    photographers: [],
    costumeDesigners: [],
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

  saveGeneralInfos(event: Movie) {
    this.movie = event;
    this.stepper.next();
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
            this.snackBar.open(this.translate.instant('app.cast_added_success'), this.translate.instant('app.close'), { duration: DURATION });
            this.stepper.next();
            this.movie.movieActors = result;
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.error_adding_cast'), this.translate.instant('app.close'), { duration: DURATION });
          }
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: DURATION });
    }
  }

  saveAwards(event: Award[]) {
    this.stepper.next();
    this.movie.awards = event;
  }
}
