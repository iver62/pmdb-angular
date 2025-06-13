import { AsyncPipe } from '@angular/common';
import { Component, effect, input, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BehaviorSubject, catchError, distinctUntilChanged, map, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../../../../app.component';
import { DelayedInputDirective } from '../../../../../directives';
import { Person, SearchConfig } from '../../../../../models';
import { MovieService } from '../../../../../services';
import { HttpUtils } from '../../../../../utils';

@Component({
  selector: 'app-persons-multiselect',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './persons-multiselect.component.html',
  styleUrl: './persons-multiselect.component.scss'
})
export class PersonsMultiselectComponent {

  @ViewChild(MatSelect, { static: true }) matSelect!: MatSelect;

  movieId = input.required<number>();
  control = input.required<FormControl>();

  selectedValues = signal<Person[]>([]); // Signal pour stocker les valeurs du multiselect

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      term: EMPTY_STRING
    }
  );

  // Liste des personnes filtrées
  readonly persons$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.term == c2.term),
    switchMap(config => this.movieService.getPersonsByMovie(this.movieId(), config.page, config.size, config.term)
      .pipe(
        tap(response => {
          this.isLoadingMore = false;
          this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
        }),
        map(response => response.body),
        map(persons => persons?.map(p => ({ ...p, display: () => p.name }))),
        catchError(() => {
          this.isLoadingMore = false;
          return of([]);
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => {
      if (this.searchConfig$.value.page == 0) {
        this.loaded = result?.length;
        return result;
      } else {
        const newArray = acc.concat(result);
        this.loaded = newArray.length;
        return newArray;
      }
    }, [])
  );

  total: number;
  loaded = 0;
  isLoadingMore = false;

  private boundOnScroll = this.onScroll.bind(this);

  constructor(
    private movieService: MovieService,
    public translate: TranslateService
  ) {
    effect(() => this.selectedValues.set(this.control().value || []));
  }

  ngAfterViewInit() {
    this.matSelect.openedChange.subscribe(
      opened => {
        const panel = document.querySelector('.mat-mdc-select-panel');
        if (!panel) return;

        opened
          ? setTimeout(() => panel.addEventListener('scroll', this.boundOnScroll), 100)
          : panel.removeEventListener('scroll', this.boundOnScroll);
      }
    );
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded < this.total) {
      this.isLoadingMore = true;
      setTimeout(() => {
        this.searchConfig$.next(
          {
            ...this.searchConfig$.value,
            page: this.searchConfig$.value.page + 1
          }
        );
      }, 100); // Délai pour éviter les appels successifs rapides
    }
  }

  selectionChange(event: MatSelectChange) {
    this.selectedValues.set(event.value);
  }

  updateSearch(event: string) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        term: event.trim()
      }
    );
  }

  clearSelection() {
    this.selectedValues.set([]);
    this.control().patchValue([]);
    this.control().markAsDirty();
  }

  eraseSearch() {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        term: EMPTY_STRING
      }
    );
  }

  compare(p1: Person, p2: Person) {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
}
