import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgPipesModule } from 'ngx-pipes';
import { Category, Country, Criterias, Type, User } from '../../models';

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

  @Output() deleteType = new EventEmitter<Type>();
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() deleteCountry = new EventEmitter<Country>();
  @Output() deleteUser = new EventEmitter<User>();

}
