import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { Movie } from '../../models';
import { MovieCardComponent } from "./movie-card/movie-card.component";

@Component({
  selector: 'app-movies-list',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MovieCardComponent,
    NgPipesModule
  ],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent {

  title = input.required<string>();
  movies = input.required<Movie[]>();

  filteredMovies = computed(() => {
    const term = this.searchTermSignal().toLowerCase();

    // Si le terme de recherche est vide, retourner tous les films
    if (!term) {
      return this.movies();
    }

    // Sinon, filtrer les films
    return this.movies().filter(movie => movie.title.toLowerCase().includes(term));
  });

  searchTermSignal = signal('');

  // Getter pour le signal
  get searchTerm(): string {
    return this.searchTermSignal();
  }

  // Setter pour le signal
  set searchTerm(value: string) {
    this.searchTermSignal.set(value);
  }

  // Effacer la recherche
  clearSearch(): void {
    this.searchTermSignal.set('');
  }
}
