import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { DURATION } from '../../app.component';
import { CeremonyAwards, Movie, MovieActor, TechnicalTeam } from '../../models';
import { MovieService } from '../../services';
import { CastingFormComponent, GeneralInfosFormComponent } from '../add-movie/components';
import { AwardsComponent, CastingComponent, MovieDetailComponent, TechnicalTeamComponent } from './components';

@Component({
  selector: 'app-movie-details',
  imports: [
    AwardsComponent,
    CastingComponent,
    CastingFormComponent,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MovieDetailComponent,
    ReactiveFormsModule,
    TechnicalTeamComponent,
    TranslatePipe
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {

  private selectedTab$ = new BehaviorSubject<number>(0);

  generalInfos: Movie;
  technicalTeam: TechnicalTeam;
  cast: MovieActor[];
  ceremoniesAwards: CeremonyAwards[];

  id: number;
  castForm: FormGroup;

  editGeneralInfos = false;
  editCasting = false;
  editAwards = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => +params.get('id')),
      tap(id => this.id = id),
      switchMap(id => {
        if (!id) return of(null);
        return this.selectedTab$.pipe(
          distinctUntilChanged(),
          switchMap(
            tabIndex => {
              if (tabIndex === 0) return this.movieService.getOne(id).pipe(map(res => ({ type: 'movie', data: res })));
              if (tabIndex === 1) return this.movieService.getTechnicalTeam(id).pipe(map(res => ({ type: 'team', data: res })));
              if (tabIndex === 2) return this.movieService.getActors(id).pipe(map(res => ({ type: 'actors', data: res || [] })));
              if (tabIndex === 3) return this.movieService.getCeremoniesAwards(id).pipe(map(res => ({ type: 'awards', data: res || [] })));
              return of(null);
            }
          )
        );
      })
    ).subscribe(result => {
      if (!result) return;

      switch (result.type) {
        case 'movie':
          this.generalInfos = result.data as Movie;
          break;
        case 'team':
          this.technicalTeam = result.data as TechnicalTeam;
          break;
        case 'actors':
          this.cast = result.data as MovieActor[];
          this.initCastingForm();
          break;
        case 'awards':
          this.ceremoniesAwards = result.data as CeremonyAwards[];
          break;
      }
    });
  }

  private initCastingForm() {
    if (!this.cast) return;

    const actorsFormArray = this.movieService.buildActorsFormArray(this.cast);

    if (!this.castForm) {
      this.castForm = this.fb.group({ actors: actorsFormArray });
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTab$.next(event.index);
  }

  cancelGeneralInfosForm() {
    this.editGeneralInfos = false;
  }

  saveGeneralInfos(event: Movie) {
    this.generalInfos = event;
    this.editGeneralInfos = false;
  }

  cancelCastForm() {
    this.editCasting = false;
    this.castForm.setControl('actors', this.movieService.buildActorsFormArray(this.cast));
  }

  saveCast() {
    if (this.castForm.valid) {
      const body: MovieActor[] = this.castForm.get('actors').value.map(
        (ma: any, index: number) => (
          {
            id: this.cast.find(a => a.person.id == ma.id)?.id ?? null,
            person: { id: ma.id, name: ma.name },
            role: ma.role,
            rank: index
          }
        )
      );

      this.movieService.saveCast(this.id, body).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.cast_update_success'), this.translate.instant('app.close'), { duration: DURATION });
            this.cast = result;
            this.castForm.markAsPristine();
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.cast_update_error'), this.translate.instant('app.close'), { duration: DURATION });
          },
          complete: () => this.editCasting = false
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: DURATION });
    }
  }
}
