import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { PhotographerService } from '../../services';

@Component({
  selector: 'app-photographers',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './photographers.component.html',
  styleUrl: './photographers.component.css'
})
export class PhotographersComponent {

  photographers$ = this.photographerService.getAll();

  constructor(public photographerService: PhotographerService) { }

}
