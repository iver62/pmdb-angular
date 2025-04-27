import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { EditorService } from '../../services';

@Component({
  selector: 'app-editors',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="editorService.getCountries" [personService]="editorService" viewTitle="app.editors" cookieName="editors-config"></app-persons>'
})
export class EditorsComponent {

  constructor(public editorService: EditorService) { }

}
