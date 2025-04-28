import { ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, input, Input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, catchError, filter, iif, map, of, scan, switchMap, take, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Person, SearchConfig } from '../../models';
import { BaseService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-person-selector',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './person-selector.component.html',
  styleUrl: './person-selector.component.scss'
})
export class PersonSelectorComponent {

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { read: MatAutocomplete }) matAutocomplete: MatAutocomplete;

  @Input() label: string;

  service = input.required<BaseService>();
  title = input.required<string>();
  formGroupName = input.required<string>();
  selectedPersons = signal<Person[]>([]);

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'nomFrFr',
      direction: 'asc',
      term: EMPTY_STRING
    }
  );

  // Liste des personnes filtrées
  readonly persons$ = this.searchConfig$.pipe(
    tap(() => this.isLoadingMore = true),
    switchMap(config => this.service().get(config.page, config.size, config.term).pipe(
      tap(response => {
        this.isLoadingMore = false;
        this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)
      }),
      map(response => response.body.filter(person => !this.selectedPersons().some(p => p.id === person.id))),
      catchError(() => {
        this.isLoadingMore = false;
        return of([]);
      })
    )),
    scan((acc: Person[], result: Person[]) => {
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

  readonly separatorKeysCodes: number[] = [ENTER];

  control: FormControl;
  total: number;
  loaded = 0;
  saving = false;
  private isLoadingMore = false;

  constructor(private rootFormGroup: FormGroupDirective) {
    effect(() => {
      this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl;
      this.selectedPersons.set(this.control.value || []);
    });
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

  onOpenedAutocomplete() {
    console.log('OPEN');

    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event.trim() });
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded + this.selectedPersons().length < this.total) {
      this.searchConfig$.next({ ...this.searchConfig$.value, page: this.searchConfig$.value.page + 1 }
      )
    }
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || EMPTY_STRING).trim();

    this.persons$.pipe(
      filter(() => value != EMPTY_STRING),
      take(1),
      tap(() => this.saving = true),
      switchMap(persons =>
        iif(
          () => !persons.map(p => p.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase()),
          this.service().save({ name: value }).pipe(
            tap(() => this.saving = false),
            catchError(error => {
              console.error(error);
              return of();
            })
          ),
          of(persons.find(p => p.name.includes(value.toLocaleLowerCase())))
        )
      ),
      filter(person => person !== null) // Ne garde que les valeurs valides
    ).subscribe(person => {
      this.selectedPersons().push(person);
      this.control?.setValue(this.selectedPersons());

      // Clear the input value
      this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
      this.input.nativeElement.value = EMPTY_STRING; // Clear the input value
    });
  }

  remove(person: Person) {
    const index = this.selectedPersons().findIndex(p => p.id === person.id);

    if (index >= 0) {
      this.selectedPersons.update(people => people.filter(p => p.id !== person.id));
      this.control?.setValue([...this.selectedPersons()]);
      this.searchConfig$.next({ ...this.searchConfig$.value, term: EMPTY_STRING });
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const person: Person = event.option.value;

    if (!this.selectedPersons().some(p => p.id === person.id)) {
      this.selectedPersons.set([...this.selectedPersons(), person]);
      this.control?.setValue([...this.selectedPersons()]);

      if (input) {
        this.input.nativeElement.value = EMPTY_STRING; // Clear the input value
      }
    }
  }
}
