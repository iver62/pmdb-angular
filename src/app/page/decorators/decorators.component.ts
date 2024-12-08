import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
    selector: 'app-decorators',
    imports: [CommonModule],
    templateUrl: './decorators.component.html',
    styleUrl: './decorators.component.css'
})
export class DecoratorsComponent {

  decorators$ = this.personService.getDecorators();

  constructor(private personService: PersonService) { }

}
