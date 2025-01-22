import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { MakeupArtistService } from '../../services';

@Component({
  selector: 'app-makeup-artists',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './makeup-artists.component.html',
  styleUrl: './makeup-artists.component.css'
})
export class MakeupArtistsComponent {

  makeupArtists$ = this.makeupArtistService.getAll();

  constructor(private makeupArtistService: MakeupArtistService) { }

}
