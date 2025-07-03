import { ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, EventEmitter, input, Output, signal, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, map, of, scan, switchMap, take, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Category, SearchConfig } from '../../models';
import { CategoryService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-category-selector',
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
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.css'
})
export class CategorySelectorComponent {

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('autoCategories', { read: MatAutocomplete }) matAutocomplete: MatAutocomplete;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 20,
      term: EMPTY_STRING
    }
  );

  formGroupName = input.required<string>();
  searchTerm$ = new BehaviorSubject(EMPTY_STRING);
  selectedCategories = signal<Category[]>([]);

  @Output() remove = new EventEmitter();

  readonly categories$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.term == c2.term),
    tap(() => this.isLoadingMore = true),
    switchMap(config => this.categoryService.getCategories(config.page, config.size, config.term).pipe(
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
    scan((acc: Category[], result: Category[]) => {
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

  readonly filteredCategories$ = combineLatest([this.categories$, toObservable(this.selectedCategories)]).pipe(
    map(([allCategories, selected]) => allCategories.filter(category => !selected.some(sel => sel.id === category.id)))
  );

  readonly separatorKeysCodes: number[] = [ENTER];

  control: FormControl<Category[]>;
  total: number;
  private loaded = 0;
  private isLoadingMore = false;

  constructor(
    private categoryService: CategoryService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => {
      this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl;
      this.selectedCategories.set(this.control.value || []);
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
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded < this.total) {
      this.searchConfig$.next({ ...this.searchConfig$.value, page: this.searchConfig$.value.page + 1 });
    }
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event });
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || EMPTY_STRING).trim();

    this.categories$.pipe(
      filter(() => value != EMPTY_STRING),
      take(1),
      map(categories => {
        const existing = categories.find(c => c.name.toLocaleLowerCase() === value);
        return existing ?? null;
      }),
      switchMap((existingCategory: Category) => existingCategory ? of(existingCategory) : this.categoryService.save({ name: value })),
    ).subscribe(result => {
      this.selectedCategories.update(categories => categories.concat(result));
      this.control.setValue(this.selectedCategories());

      // Clear the input value
      this.searchTerm$.next(EMPTY_STRING);
      this.input.nativeElement.value = EMPTY_STRING;
    });
  }

  onRemove(category: Category) {
    const index = this.selectedCategories().findIndex(c => c.id === category.id);

    if (index >= 0) {
      this.selectedCategories.update(categories => categories.filter(c => c.id !== category.id));
      this.searchTerm$.next(EMPTY_STRING);
    }

    this.remove.emit();
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const category: Category = event.option.value;

    if (!this.selectedCategories().some(c => c.id === category.id)) {
      this.selectedCategories.update(categories => categories.concat(category));
      this.control.setValue(this.selectedCategories());
      this.searchTerm$.next(EMPTY_STRING);

      if (this.input) {
        this.input.nativeElement.value = EMPTY_STRING; // Clear the input value
      }
    }
  }

}
