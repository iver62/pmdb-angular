import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgPipesModule } from 'ngx-pipes';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgPipesModule],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {

  genres$ = this.genreService.getAll();

  constructor(private genreService: GenreService) { }

}
