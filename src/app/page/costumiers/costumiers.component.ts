import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { CostumierService } from '../../services';

@Component({
  selector: 'app-costumiers',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './costumiers.component.html',
  styleUrl: './costumiers.component.css'
})
export class CostumiersComponent {

  costumiers$ = this.costumierService.getAll();

  constructor(private costumierService: CostumierService) { }

}
