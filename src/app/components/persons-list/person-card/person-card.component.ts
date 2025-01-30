import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Person } from '../../../models';

@Component({
  selector: 'app-person-card',
  imports: [
    MatCardModule,
    RouterLink
  ],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {

  person = input.required<Person>();
  route = input.required<string>();

}
