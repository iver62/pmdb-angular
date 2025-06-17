import { Component, computed, effect, EventEmitter, input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';
import { Category, Country, Type, User } from '../../models';

@Component({
  selector: 'app-multiselect',
  imports: [
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
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.scss'
})
export class MultiselectComponent {

  label = input.required<string>();
  placeholder = input.required<string>();
  placeholderLabel = input.required<string>();
  noEntriesFoundLabel = input.required<string>();
  items = input.required<Country[] | Category[] | Type[] | User[]>();
  total = input.required<number>();
  control = input.required<FormControl>();

  @Output() update = new EventEmitter<string>();

  // Signal pour stocker les valeurs du multiselect
  selectedValues = signal<(Country | Category | Type | User)[]>([]);

  checkboxChecked = computed(() => this.selectedValues()?.length > 0 && this.selectedValues()?.length === this.items()?.length);
  checkboxIndeterminate = computed(() => !this.checkboxChecked() && this.selectedValues()?.length > 0);

  constructor(public translate: TranslateService) {
    effect(() => this.selectedValues.set(this.control().value || []));
  }

  // ngAfterViewInit() {
  //   this.matSelect.openedChange.subscribe(opened => {
  //     if (opened) {
  //       setTimeout(() => {
  //         const panel = document.querySelector('.mat-select-panel');
  //         panel?.addEventListener('scroll', this.onScroll.bind(this));
  //       });
  //       this.loadNextPage();
  //     }
  //   });
  // }

  // private onScroll(event: Event) {
  //   const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

  //   if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded + this.personsToExclude().filter(id => id).length < this.total) {
  //     this.isLoadingMore = true;
  //     setTimeout(() => {
  //       this.searchConfig$.next(
  //         {
  //           ...this.searchConfig$.value,
  //           page: this.searchConfig$.value.page + 1
  //         }
  //       );
  //     }, 100); // Délai pour éviter les appels successifs rapides
  //   }
  // }

  selectionChange(event: MatSelectChange) {
    this.selectedValues.set(event.value);
  }

  openedChange(event: boolean) {
    if (event) {
      this.update.emit(EMPTY_STRING);
    }
  }

  updateSearch(event: string) {
    this.update.emit(event);
  }

  onToggleAll(event: boolean) {
    this.selectedValues.set(event ? this.items() : [])
    this.control().patchValue(event ? this.items() : []);
    this.control().markAsDirty();
  }

  clearSelection() {
    this.selectedValues.set([])
    this.control().patchValue([]);
    this.control().markAsDirty();
  }

  eraseSearch() {
    this.update.emit(EMPTY_STRING)
  }

  compareObjects(o1: Country | Category, o2: Country | Category) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
