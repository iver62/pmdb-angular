import { Component } from '@angular/core';
import { PersonsComponent } from '../../components/persons/persons.component';
import { SoundEditorService } from '../../services';

@Component({
  selector: 'app-sound-editors',
  imports: [PersonsComponent],
  template: '<app-persons [countries$]="soundEditorService.getCountries" [personService]="soundEditorService" viewTitle="app.sound_editors" cookieName="sound-editors-config"></app-persons>'
})
export class SoundEditorsComponent {

  constructor(public soundEditorService: SoundEditorService) { }

}
