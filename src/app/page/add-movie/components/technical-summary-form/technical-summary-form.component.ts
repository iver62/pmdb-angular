import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { PersonSelectorComponent } from '../../../../components';
import { Person } from '../../../../models';
import { PersonService } from '../../../../services';

@Component({
  selector: 'app-technical-summary-form',
  imports: [
    PersonSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './technical-summary-form.component.html',
  styleUrl: './technical-summary-form.component.css'
})
export class TechnicalSummaryFormComponent {

  @Input() formGroupName: string;
  form: FormGroup;

  persons: Person[] = [];

  constructor(
    private personService: PersonService,
    private rootFormGroup: FormGroupDirective
  ) { }

  ngOnInit() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.personService.getAll().subscribe(result => this.persons = result);
  }

  add(event: Person) {
    this.persons.push(event);
  }
}
