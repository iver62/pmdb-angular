
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { DURATION } from '../../app.component';
import { Movie, MovieActor, TechnicalTeam } from '../../models';
import { AuthService } from '../../services';
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
    setDesigners: [],
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

  cast: MovieActor[] = [];

  isLinear = true;
  currentStep = 0;

  constructor(
    private authService: AuthService,
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
}
