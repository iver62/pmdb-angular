import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { CasterService } from '../../services';

@Component({
  selector: 'app-casters',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './casters.component.html',
  styleUrl: './casters.component.css'
})
export class CastersComponent {

  casters$ = this.casterService.getAll();

  constructor(private casterService: CasterService) { }

}
