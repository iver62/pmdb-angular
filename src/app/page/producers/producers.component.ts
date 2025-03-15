import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { ProducerService } from '../../services';

@Component({
  selector: 'app-producers',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="producerService" viewTitle="Producteurs" cookieName="producers-config"></app-persons>'
})
export class ProducersComponent {

  constructor(public producerService: ProducerService) { }

}
