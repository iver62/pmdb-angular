import { AsyncPipe } from '@angular/common';
import { Component, effect, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, catchError, distinctUntilChanged, map, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { PersonType } from '../../enums';
import { Person, PersonWithPhotoUrl, SearchConfig } from '../../models';
import { PersonService } from '../../services';
import { HttpUtils, Utils } from '../../utils';

@Component({
  selector: 'app-autocomplete',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinner,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {

  @ViewChild('auto', { read: MatAutocomplete }) matAutocomplete: MatAutocomplete;

  control = input.required<AbstractControl | FormControl>();
  label = input.required<string>();
  personsToExclude = input<number[]>();
  toSave = input<boolean>();

  @Output() select = new EventEmitter<Person>();
  @Output() save = new EventEmitter<Person>();

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      sort: 'nomFrFr',
      direction: 'asc',
      term: EMPTY_STRING,
      excludedActorIds: this.personsToExclude()
    }
  );

  // Liste des personnes filtrées
  readonly persons$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.sort == c2.sort && c1.direction == c2.direction && c1.term == c2.term && Utils.arraysEqual(c1.excludedActorIds, c2.excludedActorIds)),
    switchMap(config => this.personService.getPersons(config.page, config.size, config.term).pipe(
      tap(response => {
        this.isLoadingMore = false;
        this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
      }),
      map(response => response.body.filter(person => !this.personsToExclude()?.includes(person.id))),
      map(persons => persons.map(p => (
        {
          ...p,
          photoUrl$: this.personService.getPhotoUrl(p.photoFileName) // Observable pour la photo
        }
      ))),
      catchError(() => {
        this.isLoadingMore = false;
        return of([]);
      })
    )),
    scan((acc: PersonWithPhotoUrl[], result: PersonWithPhotoUrl[]) => {
      if (this.searchConfig$.value.page == 0) {
        this.loaded = result.length;
        return result;
      } else {
        const newArray = acc.concat(result);
        this.loaded = newArray.length;
        return newArray;
      }
    }, [])
  );

  formControl: FormControl<string>;
  loading = false;
  private total: number;
  private loaded = 0;
  private isLoadingMore = false;

  constructor(private personService: PersonService) {
    effect(() => this.formControl = this.control() as FormControl);
    effect(() =>
      this.searchConfig$.next(
        {
          ...this.searchConfig$.value,
          excludedActorIds: this.personsToExclude().filter(id => id)
        }
      )
    );
  }

  ngAfterViewInit() {
    this.matAutocomplete.opened.subscribe(() => {
      setTimeout(() => {
        const panel = document.querySelector('.mat-mdc-autocomplete-panel') as HTMLElement;
        if (panel) {
          panel.addEventListener('scroll', this.onScroll.bind(this));
        }
      }, 100);
    });

    this.matAutocomplete.closed.subscribe(() => {
      const panel = document.querySelector('.mat-mdc-autocomplete-panel') as HTMLElement;
      if (panel) {
        panel.removeEventListener('scroll', this.onScroll.bind(this));
      }
    });
  }

  onFocus() {
    this.searchConfig$.next({ ...this.searchConfig$.value, term: EMPTY_STRING });
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event.trim() });
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded + this.personsToExclude().filter(id => id).length < this.total) {
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

  /**
   * Persister un acteur dans la base de données
   */
  saveActor() {
    if (!this.formControl.value?.trim()) {
      console.warn('Le nom de l\'acteur est vide !');
      return;
    }

    this.loading = true;
    this.personService.save({ name: this.formControl.value?.trim(), types: [PersonType.ACTOR] }).subscribe(
      {
        next: result => this.save.emit(result),
        error: e => console.error(e),
        complete: () => this.loading = false
      }
    );
  }

  selectActor(event: MatAutocompleteSelectedEvent) {
    const actor: Person = event.option.value;

    this.select.emit({ id: actor.id, name: actor.name });
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
  }
}