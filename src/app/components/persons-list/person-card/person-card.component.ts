import { AsyncPipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Person } from '../../../models';
import { BaseService } from '../../../services';

@Component({
  selector: 'app-person-card',
  imports: [
    AsyncPipe,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {

  person = input.required<Person>();
  service = input.required<BaseService>();

  photoUrl$: Observable<string>;

  constructor() {
    effect(() => this.photoUrl$ = (this.service().getPhotoUrl(this.person().photoFileName)));
  }

}
