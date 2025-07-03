import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
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
    private movieService: MovieService,
    private route: ActivatedRoute
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
}
