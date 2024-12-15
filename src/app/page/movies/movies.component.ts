import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { MovieService } from '../../services';
import { MovieComponent } from './components/movie/movie.component';

@Component({
  selector: 'app-movies',
  imports: [AsyncPipe, MovieComponent, NgPipesModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {

  movies$ = this.movieService.getAll();

  constructor(private movieService: MovieService) { }



}
