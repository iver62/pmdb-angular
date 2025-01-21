import { ENTER } from '@angular/cdk/keycodes';
import { Component, computed, effect, input, Input, signal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { Person } from '../../models';

@Component({
  selector: 'app-person-selector',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './person-selector.component.html',
  styleUrl: './person-selector.component.scss'
})
export class PersonSelectorComponent {

  @Input() label: string;
  @Input() saveFn: (person: Person) => Observable<Person>;

  persons = input.required<Person[]>();
  title = input.required<string>();
  formGroupName = input.required<string>();

  personsSignal = signal<Person[]>(null);
  selectedPersons = signal<Person[]>([]);
  currentPerson = signal<string>('');

  loading = false;

  readonly filteredPersons = computed(() =>
    this.personsSignal()
      ?.filter(person => !this.selectedPersons().some(p => p.id === person.id))
      ?.filter(person => person.name.toLowerCase().includes(this.currentPerson()?.toLowerCase()))
  );

  readonly separatorKeysCodes: number[] = [ENTER];

  control: FormControl;

  constructor(private rootFormGroup: FormGroupDirective) {
    effect(() => this.personsSignal.set(this.persons()));
    effect(() => {
      this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl;
      this.selectedPersons.set(this.control.value || []);
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.personsSignal().map(p => p.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
      this.loading = true;
      this.saveFn({ name: value })?.subscribe(result => {
        this.selectedPersons().push(result);
        this.control?.setValue(this.selectedPersons);
        this.loading = false;
      });
    }

    // Add our keyword
    if (value && this.personsSignal().map(p => p.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
      this.selectedPersons().push(this.personsSignal().find(p => p.name.toLocaleLowerCase() == value.toLocaleLowerCase()));
      this.control?.setValue(this.selectedPersons);
    }

    // Clear the input value
    // this.genreCtrl.setValue('');
    this.currentPerson.set('');
  }

  remove(person: Person) {
    const index = this.selectedPersons().findIndex(p => p.id === person.id);
    if (index >= 0) {
      this.selectedPersons.update(people => people.filter(p => p.id !== person.id));
      this.control?.setValue(this.selectedPersons);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const person: Person = event.option.value;

    if (!this.selectedPersons().some(p => p.id === person.id)) {
      this.selectedPersons().push(person);
      this.control?.setValue(this.selectedPersons);
      this.currentPerson.set('');
    }
  }

}
