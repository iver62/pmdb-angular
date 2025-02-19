import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { InputComponent, PersonsListComponent } from '../../components';
import { SoundEditorService } from '../../services';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { Person, SearchConfig } from '../../models';

@Component({
  selector: 'app-sound-editors',
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PersonsListComponent
  ],
  templateUrl: './sound-editors.component.html',
  styleUrl: './sound-editors.component.css'
})
export class SoundEditorsComponent {

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

  soundEditors$ = this.searchConfig$.pipe(
    switchMap(config =>
      this.soundEditorService.get(config.page, config.size, config.term).pipe(
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

  constructor(public soundEditorService: SoundEditorService) { }

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
