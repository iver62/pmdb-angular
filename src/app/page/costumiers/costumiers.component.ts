import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { CostumierService } from '../../services';

@Component({
  selector: 'app-costumiers',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="costumierService.getCountries" [personService]="costumierService" viewTitle="Costumiers" cookieName="costumiers-config"></app-persons>'
})
export class CostumiersComponent {

  constructor(public costumierService: CostumierService) { }

}
