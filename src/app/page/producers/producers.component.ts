import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { ProducerService } from '../../services';

@Component({
  selector: 'app-producers',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './producers.component.html',
  styleUrl: './producers.component.css'
})
export class ProducersComponent {

  producers$ = this.producerService.getAll();

  constructor(public producerService: ProducerService) { }

}
