import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { EditorService } from '../../services';

@Component({
  selector: 'app-editors',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="editorService" viewTitle="Monteurs" cookieName="editors-config"></app-persons>'
})
export class EditorsComponent {

  constructor(public editorService: EditorService) { }

}
