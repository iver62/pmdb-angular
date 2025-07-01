import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, EventEmitter, input, Output, signal, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, map, of, scan, startWith, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Language } from '../../enums';
import { Country, SearchConfig } from '../../models';
import { CountryService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-country-selector',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.css'
})
export class CountrySelectorComponent {

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('autoCountries', { read: MatAutocomplete }) matAutocomplete: MatAutocomplete;

  formGroupName = input.required<string>();
  selectedCountries = signal<Country[]>([]);

  @Output() remove = new EventEmitter();

  currentLang$ = this.translate.onLangChange.pipe(
    map(result => result.lang),
    startWith(localStorage.getItem('lang') || this.translate.defaultLang)
  );

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      sort: this.translate.currentLang == Language.FR ? 'nomFrFr' : 'nomEnGb',
      direction: 'asc',
      term: EMPTY_STRING,
      lang: this.translate.currentLang as Language
    }
  );

  // Liste des pays filtrés
  readonly countries$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.sort == c2.sort && c1.direction == c2.direction && c1.term == c2.term && c1.lang === c2.lang),
    tap(() => this.isLoadingMore = true),
    switchMap(config => this.countryService.getCountries(config.page, config.size, config.term, config.sort, config.lang).pipe(
      tap(response => {
        this.isLoadingMore = false;
        this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)
      }),
      map(response => response.body ?? []),
      catchError(() => {
        this.isLoadingMore = false;
        return of([]);
      })
    )),
    scan((acc: Country[], result: Country[]) => {
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

  readonly filteredCountries$ = combineLatest([this.countries$, toObservable(this.selectedCountries)]).pipe(
    map(([allCountries, selected]) =>
      allCountries.filter(country => !selected.some(sel => sel.id === country.id))
    )
  );

  control: FormControl;
  total: number;
  language = Language;
  private loaded = 0;
  private isLoadingMore = false;

  constructor(
    private countryService: CountryService,
    private rootFormGroup: FormGroupDirective,
    private translate: TranslateService
  ) {
    effect(() => {
      this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl;
      this.selectedCountries.set(this.control.value || []);
    });

    translate.onLangChange.subscribe(result => this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        page: 0,
        sort: result.lang == Language.FR ? 'nomFrFr' : 'nomEnGb',
        lang: result.lang as Language
      }
    ))
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
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event });
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded < this.total) {
      this.searchConfig$.next({ ...this.searchConfig$.value, page: this.searchConfig$.value.page + 1 }
      )
    }
  }

  onRemove(country: Country) {
    const index = this.selectedCountries().findIndex(c => c.id === country.id);

    if (index >= 0) {
      this.selectedCountries.update(countries => countries.filter(c => c.id !== country.id));
      this.control.setValue([...this.selectedCountries()]);
      this.searchConfig$.next({ ...this.searchConfig$.value, term: EMPTY_STRING });
    }

    this.remove.emit();
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const country: Country = event.option.value;

    if (!this.selectedCountries().some(c => c.id === country.id)) {
      this.selectedCountries.set([...this.selectedCountries(), country]);
      this.control.setValue([...this.selectedCountries()]);
      this.searchConfig$.next({ ...this.searchConfig$.value, term: EMPTY_STRING });

      if (input) {
        this.input.nativeElement.value = EMPTY_STRING; // Clear the input value
      }
    }
  }
}