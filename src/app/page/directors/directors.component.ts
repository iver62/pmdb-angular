import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { DirectorService } from '../../services';

@Component({
  selector: 'app-directors',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './directors.component.html',
  styleUrl: './directors.component.css'
})
export class DirectorsComponent {

  directors$ = this.directorService.getAll();

  constructor(private directorService: DirectorService) { }

}
