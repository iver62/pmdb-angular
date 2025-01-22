import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { ScreenwriterService } from '../../services';

@Component({
  selector: 'app-screenwriters',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './screenwriters.component.html',
  styleUrl: './screenwriters.component.css'
})
export class ScreenwritersComponent {

  screenwriters$ = this.screenwriterService.getAll();

  constructor(private screenwriterService: ScreenwriterService) { }

}
