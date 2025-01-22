import { Component, input } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { Person } from '../../models';

@Component({
  selector: 'app-persons-list',
  imports: [NgPipesModule],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css'
})
export class PersonsListComponent {

  persons = input.required<Person[]>();

}
