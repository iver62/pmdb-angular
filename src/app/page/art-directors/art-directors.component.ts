import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { ArtDirectorService } from '../../services';

@Component({
  selector: 'app-art-directors',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './art-directors.component.html',
  styleUrl: './art-directors.component.css'
})
export class ArtDirectorsComponent {

  artDirectors$ = this.artDirectorService.getAll();

  constructor(public artDirectorService: ArtDirectorService) { }
}
