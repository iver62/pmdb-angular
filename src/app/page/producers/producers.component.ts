import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-producers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producers.component.html',
  styleUrl: './producers.component.css'
})
export class ProducersComponent {

  producers$ = this.personService.getProducers();

  constructor(private personService: PersonService) { }

}
