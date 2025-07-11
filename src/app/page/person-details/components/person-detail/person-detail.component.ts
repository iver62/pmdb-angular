import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, EventEmitter, Input, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { Person } from '../../../../models';
import { AuthService, PersonService } from '../../../../services';
import { PersonUtils } from '../../../../utils';

@Component({
  selector: 'app-person-detail',
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    TranslatePipe
  ],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css'
})
export class PersonDetailComponent {

  person = input.required<Person>();

  @Input() canDelete: boolean;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  photoUrl$: Observable<string>;

  age: number;
  ageOfDeath: number;

  constructor(
    public authService: AuthService,
    private personService: PersonService
  ) {
    effect(() => {
      this.photoUrl$ = this.personService.getPhotoUrl(this.person()?.photoFileName)
      this.age = PersonUtils.calculateAge(this.person());
      this.ageOfDeath = PersonUtils.calculateAgeOfDeath(this.person());
    });
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

}
