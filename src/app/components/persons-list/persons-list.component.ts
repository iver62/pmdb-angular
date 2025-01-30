import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { Person } from '../../models';
import { PersonCardComponent } from './person-card/person-card.component';

@Component({
  selector: 'app-persons-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    PersonCardComponent
  ],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css'
})
export class PersonsListComponent {

  title = input.required<string>();
  persons = input.required<Person[]>();
  route = input.required<string>();

  view: 'table' | 'cards' = 'cards';

  switchView(view: 'table' | 'cards') {
    this.view = view;
  }

}
