import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { InputComponent, PersonsListComponent } from '../../components';
import { Person, SearchConfig } from '../../models';
import { MusicianService } from '../../services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-musicians',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PersonsListComponent
  ],
  templateUrl: './musicians.component.html',
  styleUrl: './musicians.component.css'
})
export class MusiciansComponent {

  total: number;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'name',
      direction: 'Ascending',
      term: ''
    }
  );

  musicians$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.musicianService.get(config.page, config.size, config.term).pipe(
        tap(response => this.total = +(response.headers.get('X-Total-Count') ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux acteurs
  );

  constructor(public musicianService: MusicianService) { }

  onSearch(event: string) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        term: event
      }
    );
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
