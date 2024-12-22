import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { catchError, switchMap, tap } from 'rxjs';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-genres',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule
  ],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {

  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  genres$ = this.genreService.getAll();

  constructor(private genreService: GenreService) { }

  deleteGenre(id: number) {
    this.genres$ = this.genreService.delete(id).pipe(
      switchMap(() => this.genreService.getAll()),
      tap(() => this._snackBar.open('Genre supprimé avec succès', 'Done', { duration: this.durationInSeconds * 1000 })),
      catchError((error) => {
        console.error(error);
        this._snackBar.open('Impossible de supprimer le genre', 'Error', { duration: this.durationInSeconds * 1000 })
        return this.genreService.getAll();
      })
    );
  }

}
