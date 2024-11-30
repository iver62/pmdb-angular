import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-screenwriters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screenwriters.component.html',
  styleUrl: './screenwriters.component.css'
})
export class ScreenwritersComponent {

  screenwriters$ = this.personService.getScreenwriters();

  constructor(private personService: PersonService) { }

}
