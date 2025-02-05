import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { SoundEditorService } from '../../services';

@Component({
  selector: 'app-sound-editors',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './sound-editors.component.html',
  styleUrl: './sound-editors.component.css'
})
export class SoundEditorsComponent {

  soundEditors$ = this.soundEditorService.getAll();

  constructor(public soundEditorService: SoundEditorService) { }

}
