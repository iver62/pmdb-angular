import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { MoviesListComponent, MoviesTableComponent, ToolbarComponent } from '../../components';
import { CriteriasReminderComponent } from "../../components/criterias-reminder/criterias-reminder.component";
import { View } from '../../enums';
import { Country, Criterias, Genre, Movie, SearchConfig, SortOption, User } from '../../models';
import { MovieService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-movies',
  imports: [
    AsyncPipe,
    CriteriasReminderComponent,
    InfiniteScrollDirective,
    MatPaginatorModule,
    MoviesListComponent,
    MoviesTableComponent,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  view = View;
  total: number;
  pageSizeOptions = [25, 50, 100];
  sortOptions: SortOption[] = [
    { active: 'title', label: 'app.title', direction: 'asc' },
    { active: 'originalTitle', label: 'app.original_title', direction: EMPTY_STRING },
    { active: 'releaseDate', label: 'app.release_date', direction: EMPTY_STRING },
    { active: 'runningTime', label: 'app.duration', direction: EMPTY_STRING },
    { active: 'budget', label: 'app.budget', direction: EMPTY_STRING },
    { active: 'boxOffice', label: 'app.box_office', direction: EMPTY_STRING },
    { active: 'user.username', label: 'app.user', direction: EMPTY_STRING },
    { active: 'awardsCount', label: 'app.number_of_awards', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'app.add_date', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'app.last_update', direction: EMPTY_STRING }
  ];

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: this.cookieService.get('movies-config') ? (JSON.parse(this.cookieService.get('movies-config')) as SearchConfig).sort : 'title',
      direction: this.cookieService.get('movies-config') ? (JSON.parse(this.cookieService.get('movies-config')) as SearchConfig).direction : 'asc',
      term: EMPTY_STRING,
      criterias: this.cookieService.get('movies-config') ? (JSON.parse(this.cookieService.get('movies-config')) as SearchConfig).criterias : {},
      view: this.cookieService.get('movies-config') ? (JSON.parse(this.cookieService.get('movies-config')) as SearchConfig).view : View.CARDS
    }
  );

  movies$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.sort == c2.sort && c1.direction == c2.direction && c1.term == c2.term && c1.criterias === c2.criterias),
    switchMap(config =>
      this.movieService.getMovies(config.page, config.size, config.term, config.sort, config.direction, config.criterias).pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Movie[], result: Movie[]) => this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE
      ? result
      : acc.concat(result) // Concatène les nouvelles données
    )
  );

  sorts$: Observable<SortOption[]> = this.searchConfig$.pipe(
    map(config =>
      this.sortOptions.map(option => (
        {
          ...option,
          direction: option.active === config.sort ? config.direction : EMPTY_STRING // Met à jour la direction du tri
        }
      ))
    )
  );

  constructor(
    private cookieService: CookieService,
    public movieService: MovieService
  ) { }

  onDeleteGenre(genre: Genre) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.searchConfig$.value.criterias,
          genres: this.searchConfig$.value.criterias.genres.filter(g => g.id != genre.id)
        }
      }
    );
    this.cookieService.set('movies-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onDeleteCountry(country: Country) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.searchConfig$.value.criterias,
          countries: this.searchConfig$.value.criterias.countries.filter(c => c.id != country.id)
        }
      }
    );
    this.cookieService.set('movies-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onDeleteUser(user: User) {
    this.updateSearchConfig(
      {
        page: 0,
        criterias: {
          ...this.searchConfig$.value.criterias,
          users: this.searchConfig$.value.criterias.users.filter(u => u.id != user.id)
        }
      }
    );
    this.cookieService.set('movies-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onFilter(event: Criterias) {
    this.updateSearchConfig({ page: 0, criterias: event });
    this.cookieService.set('movies-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSwitchView(view: View) {
    this.updateSearchConfig({ page: 0, view: view });
    this.cookieService.set('movies-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSort(event: SortOption) {
    if (this.searchConfig$.value.view == View.TABLE) {
      this.paginator.firstPage();
    }

    this.updateSearchConfig({ page: 0, sort: event.active, direction: event.direction });
    this.cookieService.set('movies-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSearch(event: string) {
    if (typeof event == 'string') {
      if (this.searchConfig$.value.view == View.CARDS) {
        this.scrollContainer.nativeElement.scrollTo({ top: 0 });
      }
      this.updateSearchConfig({ page: 0, term: event?.trim() })
    };
  }

  onScroll() {
    this.updateSearchConfig({ page: this.searchConfig$.value.page + 1 });
  }

  onPageChange(event: PageEvent) {
    this.updateSearchConfig({ page: event.pageIndex, size: event.pageSize });
  }

  private updateSearchConfig(newConfig: Partial<SearchConfig>) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        ...newConfig
      }
    );
  }
}