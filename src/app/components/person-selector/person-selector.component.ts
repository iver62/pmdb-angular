import { ENTER } from '@angular/cdk/keycodes';
import { Component, computed, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgPipesModule } from 'ngx-pipes';
import { Person } from '../../models';
import { PersonService } from '../../services';

@Component({
  selector: 'app-person-selector',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './person-selector.component.html',
  styleUrl: './person-selector.component.css'
})
export class PersonSelectorComponent {

  @Input() formGroupName: string;
  @Input() label: string;

  @Output() addPerson = new EventEmitter<Person>();

  persons = input.required<Person[]>();
  title = input.required<string>();

  personsSignal = signal<Person[]>(null);
  selectedPersons = signal<Person[]>([]);
  currentPerson = signal<string>('');

  readonly filteredPersons = computed(() =>
    this.personsSignal()
      ?.filter(person => !this.selectedPersons().some(p => p.id === person.id))
      ?.filter(person => person.name.toLowerCase().includes(this.currentPerson()?.toLowerCase()))
  );

  control: FormControl;

  readonly separatorKeysCodes: number[] = [ENTER];

  constructor(
    private personService: PersonService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => this.personsSignal.set(this.persons()));
  }

  ngOnInit() {
    this.control = this.rootFormGroup.control.get(this.formGroupName) as FormControl;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.personsSignal().map(p => p.name.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
      this.personService.save({ name: value }).subscribe(result => {
        this.addPerson.emit(result);
        this.selectedPersons().push(result);
        this.control?.setValue(this.selectedPersons);
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
