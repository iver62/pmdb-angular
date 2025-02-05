import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { EditorService } from '../../services';

@Component({
  selector: 'app-editors',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './editors.component.html',
  styleUrl: './editors.component.css'
})
export class EditorsComponent {

  editors$ = this.editorService.getAll();

  constructor(public editorService: EditorService) { }

}
