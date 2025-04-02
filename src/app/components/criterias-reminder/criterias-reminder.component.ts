import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgPipesModule } from 'ngx-pipes';
import { Country, Criterias, Genre, User } from '../../models';

@Component({
  selector: 'app-criterias-reminder',
  imports: [
    MatIconModule,
    NgPipesModule
  ],
  templateUrl: './criterias-reminder.component.html',
  styleUrl: './criterias-reminder.component.css'
})
export class CriteriasReminderComponent {

  criterias = input.required<Criterias>();

  @Output() deleteGenre = new EventEmitter<Genre>();
  @Output() deleteCountry = new EventEmitter<Country>();
  @Output() deleteUser = new EventEmitter<User>();

}
