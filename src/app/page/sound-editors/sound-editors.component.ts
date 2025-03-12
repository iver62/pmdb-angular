import { Component } from '@angular/core';
import { PersonsComponent } from '../../components';
import { SoundEditorService } from '../../services';

@Component({
  selector: 'app-sound-editors',
  imports: [PersonsComponent],
  template: '<app-persons [personService]="soundEditorService" viewTitle="Ingénieurs du son" cookieName="sound-editors-config"></app-persons>'
})
export class SoundEditorsComponent {

  constructor(public soundEditorService: SoundEditorService) { }

}
