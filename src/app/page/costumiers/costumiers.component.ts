import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-costumiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './costumiers.component.html',
  styleUrl: './costumiers.component.css'
})
export class CostumiersComponent {

  costumiers$ = this.personService.getCostumiers();

  constructor(private personService: PersonService) { }

}
