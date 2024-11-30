import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { MovieService } from '../../services';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, NgPipesModule, RouterModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {

  movies$ = this.movieService.getAll();

  constructor(private movieService: MovieService) { }

}
