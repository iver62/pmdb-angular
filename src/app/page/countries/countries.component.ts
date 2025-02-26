import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { CountriesListComponent, InputComponent } from '../../components';
import { Country, SearchConfig } from '../../models';
import { CountryService } from '../../services';

@Component({
  selector: 'app-countries',
  imports: [
    AsyncPipe,
    CountriesListComponent,
    InfiniteScrollDirective,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'nomFrFr',
      direction: 'Ascending',
      term: ''
    }
  );

  countries$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.countryService.getCountries(config.page, config.size, config.term).pipe(
        tap(response => this.total = +(response.headers.get('X-Total-Count') ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Country[], result: Country[]) => this.searchConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux pays
  );

  total: number;

  constructor(private countryService: CountryService) { }

  onSearch(event: string) {
    if (typeof event === 'string') {
      this.searchConfig$.next(
        {
          ...this.searchConfig$.value,
          page: 0,
          term: event
        }
      );
    }
  }

  onScroll() {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: this.searchConfig$.value.page + 1
      }
    );
  }
}
