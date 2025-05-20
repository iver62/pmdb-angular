import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PersonSelectorComponent } from '../../../../components';
import { PersonType } from '../../../../enums';
import { Person } from '../../../../models';
import { PersonService } from '../../../../services';

@Component({
  selector: 'app-technical-team-form',
  imports: [
    PersonSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './technical-team-form.component.html',
  styleUrl: './technical-team-form.component.scss'
})
export class TechnicalTeamFormComponent {

  @Input() form: FormGroup;

  personType = PersonType;

  constructor(private personService: PersonService) { }

  addType(person: Person, type: PersonType) {
    if (!person.types.includes(type)) {
      this.personService.addPersonType(person.id, type).subscribe();
    }
  }
}
