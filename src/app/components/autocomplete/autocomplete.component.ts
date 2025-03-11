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
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Person, SearchConfig } from '../../models';
import { ActorService } from '../../services';
import { HttpUtils } from '../../utils';

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
      size: 50,
      sort: 'nomFrFr',
      direction: 'asc',
      term: EMPTY_STRING
    }
  );

  // Liste des personnes filtrées
  readonly persons$ = this.searchConfig$.pipe(
    switchMap(config => this.actorService.get(config.page, config.size, config.term).pipe(
      tap(response => {
        this.isLoadingMore = false;
        this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
      }),
      map(response => response.body.filter(person => !this.personsToExclude()?.includes(person.id))),
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

  formControl: FormControl<string>;
  loading = false;
  private total: number;
  private loaded = 0;
  private isLoadingMore = false;

  constructor(
    private actorService: ActorService,
    private sanitizer: DomSanitizer
  ) {
    effect(() => this.formControl = this.control() as FormControl);
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
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event.trim() });
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded + this.personsToExclude.length < this.total) {
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
    this.actorService.save({ name: this.formControl.value?.trim() }).subscribe(
      {
        next: result => this.save.emit(result),
        error: e => console.error(e),
        complete: () => {
          this.loading = false;
          this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
        }
      }
    );
  }

  selectActor(event: MatAutocompleteSelectedEvent) {
    const actor: Person = event.option.value;

    this.select.emit({ id: actor.id, name: actor.name });
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
  }

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.actorService.getPhotoUrl(photoFileName));
  }

}
