import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../models';

@Component({
  selector: 'app-movie-card',
  imports: [
    DatePipe,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {

  movie = input.required<Movie>();

}
