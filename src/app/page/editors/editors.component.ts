import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
    selector: 'app-editors',
    imports: [CommonModule],
    templateUrl: './editors.component.html',
    styleUrl: './editors.component.css'
})
export class EditorsComponent {

  editors$ = this.personService.getEditors();

  constructor(private personService: PersonService) { }

}
