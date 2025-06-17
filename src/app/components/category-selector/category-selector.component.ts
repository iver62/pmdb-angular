import { ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, map, of, switchMap, take, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Category } from '../../models';
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

  formGroupName = input.required<string>();
  searchTerm$ = new BehaviorSubject(EMPTY_STRING);
  selectedCategories = signal<Category[]>([]);

  readonly categories$ = this.searchTerm$.pipe(
    distinctUntilChanged((t1, t2) => t1 == t2),
    switchMap(term => this.categoryService.getAll(term)
      .pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => response.body ?? []),
        catchError(() => of([])) // En cas d'erreur, retourner une liste vide
      )
    )
  );

  readonly filteredCategories$ = combineLatest([this.categories$, toObservable(this.selectedCategories)]).pipe(
    map(([allCategories, selected]) => allCategories.filter(category => !selected.some(sel => sel.id === category.id)))
  );

  readonly separatorKeysCodes: number[] = [ENTER];

  control: FormControl<Category[]>;
  total: number;

  constructor(
    private categoryService: CategoryService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => {
      this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl;
      this.selectedCategories.set(this.control.value || []);
    });
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

  remove(category: Category) {
    const index = this.selectedCategories().findIndex(c => c.id === category.id);

    if (index >= 0) {
      this.selectedCategories.update(categories => categories.filter(c => c.id !== category.id));
      this.searchTerm$.next(EMPTY_STRING);
    }
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
