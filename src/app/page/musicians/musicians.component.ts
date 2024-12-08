import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
    selector: 'app-musicians',
    imports: [CommonModule],
    templateUrl: './musicians.component.html',
    styleUrl: './musicians.component.css'
})
export class MusiciansComponent {

  musicians$ = this.personService.getMusicians();

  constructor(private personService: PersonService) { }

}
