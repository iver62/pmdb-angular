import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { MusicianService } from '../../services';

@Component({
  selector: 'app-musicians',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './musicians.component.html',
  styleUrl: './musicians.component.css'
})
export class MusiciansComponent {

  musicians$ = this.musicianService.getAll();

  constructor(public musicianService: MusicianService) { }

}
