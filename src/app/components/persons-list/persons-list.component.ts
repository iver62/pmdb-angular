import { Component, input } from '@angular/core';
import { Person } from '../../models';
import { PersonCardComponent } from './person-card/person-card.component';

@Component({
  selector: 'app-persons-list',
  imports: [PersonCardComponent],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css'
})
export class PersonsListComponent {

  persons = input.required<Person[]>();

}
