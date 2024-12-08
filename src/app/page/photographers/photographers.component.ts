import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
    selector: 'app-photographers',
    imports: [CommonModule],
    templateUrl: './photographers.component.html',
    styleUrl: './photographers.component.css'
})
export class PhotographersComponent {

  photographers$ = this.personService.getPhotographers();

  constructor(private personService: PersonService) { }

}
