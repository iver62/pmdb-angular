import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-directors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './directors.component.html',
  styleUrl: './directors.component.css'
})
export class DirectorsComponent {

  directors$ = this.personService.getDirectors();

  constructor(private personService: PersonService) { }

}
