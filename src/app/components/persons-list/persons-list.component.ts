import { Component, Input, input } from '@angular/core';
import { Person } from '../../models';
import { BaseService } from '../../services';
import { PersonCardComponent } from './person-card/person-card.component';

@Component({
  selector: 'app-persons-list',
  imports: [PersonCardComponent],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css'
})
export class PersonsListComponent {

  persons = input.required<Person[]>();

  @Input() service: BaseService;

}
