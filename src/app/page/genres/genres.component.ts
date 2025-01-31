import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { catchError, map, tap } from 'rxjs';
import { GenreService } from '../../services';

@Component({
  selector: 'app-genres',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    RouterLink
  ],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {

  private snackBarDuration = 5000;

  genres$ = this.genreService.getAll().pipe(
    tap(() => console.log('Genres chargés')),
    catchError(error => {
      console.error('Erreur de chargement des genres', error);
      this.snackBar.open('Erreur lors du chargement des genres', 'Error', { duration: this.snackBarDuration });
      throw error;
    })
  );

  constructor(
    private genreService: GenreService,
    private snackBar: MatSnackBar
  ) { }

  deleteGenre(id: number) {
    this.genres$ = this.genres$.pipe(
      map(genres => genres.filter(g => g.id !== id)) // Mise à jour locale sans recharge
    );

    this.genreService.delete(id).subscribe(
      {
        next: () => this.snackBar.open('Genre supprimé avec succès', 'Done', { duration: this.snackBarDuration }),
        error: e => {
          console.error(e);
          this.snackBar.open('Impossible de supprimer le genre', 'Error', { duration: this.snackBarDuration })
        }
      }
    );
  }
}
