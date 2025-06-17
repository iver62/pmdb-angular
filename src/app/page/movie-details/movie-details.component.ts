import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { Award, Movie, MovieActor, TechnicalTeam } from '../../models';
import { MovieService } from '../../services';
import { AwardsFormComponent, CastingFormComponent, GeneralInfosFormComponent } from '../add-movie/components';
import { AwardsComponent, CastingComponent, MovieDetailComponent, TechnicalTeamComponent } from './components';

@Component({
  selector: 'app-movie-details',
  imports: [
    AwardsComponent,
    AwardsFormComponent,
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

  private readonly duration = 5000;
  private selectedTab$ = new BehaviorSubject<number>(0);

  generalInfos: Movie;
  technicalTeam: TechnicalTeam;
  cast: MovieActor[];
  awards: Award[];

  id: number;
  generalInfosForm: FormGroup;
  castForm: FormGroup;
  awardsForm: FormGroup;

  editGeneralInfos = false;
  editCasting = false;
  editAwards = false;

  imageFile: File | null = null;

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
              if (tabIndex === 3) return this.movieService.getAwards(id).pipe(map(res => ({ type: 'awards', data: res || [] })));
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
          this.initGeneralInfosForm();
          break;
        case 'team':
          this.technicalTeam = result.data as TechnicalTeam;
          break;
        case 'actors':
          this.cast = result.data as MovieActor[];
          this.initCastingForm();
          break;
        case 'awards':
          this.awards = result.data as Award[];
          this.initAwardsForm();
          break;
      }
    });
  }

  private initGeneralInfosForm() {
    if (!this.generalInfos) return;

    if (!this.generalInfosForm) {
      this.generalInfosForm = this.fb.group(
        {
          id: [this.generalInfos.id],
          title: [this.generalInfos.title, Validators.required],
          originalTitle: [this.generalInfos.originalTitle],
          synopsis: [this.generalInfos.synopsis],
          releaseDate: [this.generalInfos.releaseDate],
          runningTime: [this.generalInfos.runningTime],
          budget: [this.generalInfos.budget],
          budgetCurrency: [this.generalInfos.budgetCurrency],
          boxOffice: [this.generalInfos.boxOffice],
          boxOfficeCurrency: [this.generalInfos.boxOfficeCurrency],
          posterFileName: [this.generalInfos.posterFileName],
          countries: [this.generalInfos.countries],
          categories: [this.generalInfos.categories],
          user: [this.generalInfos.user]
        }
      );
    } else {
      this.generalInfosForm.patchValue(this.generalInfos);
    }
  }

  private initCastingForm() {
    if (!this.cast) return;

    const actorsFormArray = this.movieService.buildActorsFormArray(this.cast);

    if (!this.castForm) {
      this.castForm = this.fb.group({ actors: actorsFormArray });
    } else {
      this.castForm.setValue({ actors: actorsFormArray });
    }
  }

  private initAwardsForm() {
    if (!this.awards) return;

    const awardsFormArray = this.movieService.buildAwardsFormArray(this.awards);

    if (!this.awardsForm) {
      this.awardsForm = this.fb.group({ awards: awardsFormArray });
    } else {
      this.awardsForm.setValue({ awards: awardsFormArray });
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTab$.next(event.index);
  }

  selectImage(event: any) {
    this.imageFile = event;
  }

  cancelGeneralInfosForm() {
    this.editGeneralInfos = false;
    this.generalInfosForm.patchValue(this.generalInfos);
  }

  cancelCastForm() {
    this.editCasting = false;
    this.castForm.setControl('actors', this.movieService.buildActorsFormArray(this.cast));
  }

  cancelAwardsForm() {
    this.editAwards = false;
    this.awardsForm.setControl('awards', this.movieService.buildAwardsFormArray(this.awards));
  }

  saveGeneralInfos() {
    if (this.generalInfosForm.valid) {
      this.movieService.updateMovie(this.imageFile, this.generalInfosForm.value).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.movie_updated_success'), this.translate.instant('app.close'), { duration: this.duration });
            this.generalInfos = result;
            this.generalInfosForm.patchValue(this.generalInfos);
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.movie_updated_error'), this.translate.instant('app.close'), { duration: this.duration });
          },
          complete: () => this.editGeneralInfos = false
        }
      );
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
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
            this.snackBar.open(this.translate.instant('app.cast_update_success'), this.translate.instant('app.close'), { duration: this.duration });
            this.cast = result;
            this.castForm.markAsPristine();
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.cast_update_error'), this.translate.instant('app.close'), { duration: this.duration });
          },
          complete: () => this.editCasting = false
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
  }

  saveAwards() {
    if (this.awardsForm.valid) {
      this.movieService.saveAwards(this.id, this.awardsForm.get('awards').value).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant('app.awards_update_success'), this.translate.instant('app.close'), { duration: this.duration });
            this.awards = result;
            this.awards.forEach(a => a.persons = a.persons.map(p => ({ ...p, display: () => p.name })));
            this.awardsForm.patchValue({ awards: this.awards });
          },
          error: error => {
            console.error(error);
            this.snackBar.open(this.translate.instant('app.awards_update_error'), this.translate.instant('app.close'), { duration: this.duration });
          },
          complete: () => this.editAwards = false
        }
      )
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: this.duration });
    }
  }
}
