import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Movie } from '../../../../models';

@Component({
  selector: 'app-movie',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent {

  movie = input.required<Movie>();

  deleteMovie(id: number) {
    console.log(id);

  }

}
