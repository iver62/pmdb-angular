import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { DecoratorService } from '../../services';

@Component({
  selector: 'app-decorators',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="decoratorService" viewTitle="Décorateurs" cookieName="decorators-config"></app-persons>'
})
export class DecoratorsComponent {

  constructor(public decoratorService: DecoratorService) { }

}
