import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { DURATION } from '../../app.component';
import { ConfirmationDialogComponent } from '../../components';
import { CeremonyAwards, Movie, MovieActor, TechnicalTeam } from '../../models';
import { AuthService, MovieService } from '../../services';
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
    MatTabsModule,
    MatTooltipModule,
    MovieDetailComponent,
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

  editGeneralInfos = false;
  editCasting = false;
  editAwards = false;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
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
          break;
        case 'awards':
          this.ceremoniesAwards = result.data as CeremonyAwards[];
          break;
      }
    });
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
  }

  saveCast(event: MovieActor[]) {
    this.cast = event;
    this.editCasting = false;
  }

  deleteMovie() {
    this.dialog.open(ConfirmationDialogComponent, {
      minWidth: '30vw',  // Définit la largeur à 30% de l'écran
      data: {
        title: this.translate.instant('app.confirm'),
        message: this.translate.instant('app.confirm_delete_message', { data: this.generalInfos.title })
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.movieService.deleteMovie(this.generalInfos.id).subscribe(
          {
            next: () => {
              this.snackBar.open(this.translate.instant('app.delete_success_message', { data: this.generalInfos.title }), this.translate.instant('app.close'), { duration: DURATION });
              this.router.navigateByUrl('/movies');
            },
            error: error => {
              console.error(error);
              this.snackBar.open(error.error, this.translate.instant('app.error'), { duration: DURATION });
            }
          }
        );
      }
    })
  }
}
