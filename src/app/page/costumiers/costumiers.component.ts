import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { CostumierService } from '../../services';

@Component({
  selector: 'app-costumiers',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="costumierService" viewTitle="Costumiers" cookieName="decorators-config"></app-persons>'
})
export class CostumiersComponent {

  constructor(public costumierService: CostumierService) { }

}
