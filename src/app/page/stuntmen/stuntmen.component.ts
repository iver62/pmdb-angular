import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { StuntmanService } from '../../services';

@Component({
  selector: 'app-stuntmen',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './stuntmen.component.html',
  styleUrl: './stuntmen.component.css'
})
export class StuntmenComponent {

  stuntmen$ = this.stuntmanService.getAll();

  constructor(public stuntmanService: StuntmanService) { }

}
