import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { HairDresserService } from '../../services';

@Component({
  selector: 'app-hair-dressers',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './hair-dressers.component.html',
  styleUrl: './hair-dressers.component.css'
})
export class HairDressersComponent {

  hairDressers$ = this.hairDresserService.getAll();

  constructor(public hairDresserService: HairDresserService) { }

}
