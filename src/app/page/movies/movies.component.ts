import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { InputComponent, MoviesListComponent, MoviesTableComponent, ToolbarComponent } from '../../components';
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
    InputComponent,
    MatPaginatorModule,
    MoviesListComponent,
    MoviesTableComponent,
    ToolbarComponent
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  view = View;
  total: number;
  pageSizeOptions = [25, 50, 100];
  sortOptions: SortOption[] = [
    { active: 'title', label: 'Titre', direction: 'asc' },
    { active: 'releaseDate', label: 'Date de sortie', direction: EMPTY_STRING },
    { active: 'runningTime', label: 'Durée', direction: EMPTY_STRING },
    { active: 'budget', label: 'Budget', direction: EMPTY_STRING },
    { active: 'boxOffice', label: 'Box-office', direction: EMPTY_STRING },
    { active: 'creationDate', label: 'Date d\'ajout', direction: EMPTY_STRING },
    { active: 'lastUpdate', label: 'Dernière modification', direction: EMPTY_STRING }
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
    scan((acc: Movie[], result: Movie[]) => this.searchConfig$.value.page == 0 || this.searchConfig$.value.view == View.TABLE // Concatène les nouvelles données
      ? result
      : acc.concat(result), []
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