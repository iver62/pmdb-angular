import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { MoviesListComponent } from '../../components';
import { GenreService } from '../../services';

@Component({
  selector: 'app-genre-details',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MoviesListComponent,
    RouterLink
  ],
  templateUrl: './genre-details.component.html',
  styleUrl: './genre-details.component.css'
})
export class GenreDetailsComponent {

  movies$ = this.route.paramMap.pipe(
    switchMap(params => this.genreService.getMovies(+params.get('id')))
  );
  name = this.router.getCurrentNavigation().extras.state['name'];

  constructor(
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log();
  }

}
