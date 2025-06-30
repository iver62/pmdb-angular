import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DURATION } from '../../../../app.component';
import { Movie } from '../../../../models';
import { MovieService } from '../../../../services';

@Component({
  selector: 'app-movie',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent {

  movie = input.required<Movie>();
  private _snackBar = inject(MatSnackBar);

  constructor(
    private translate: TranslateService,
    private movieService: MovieService
  ) { }

  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe(
      {
        next: () => {
          this._snackBar.open('Film supprimé avec succès', this.translate.instant('app.close'), { duration: DURATION })
          window.location.reload();
        },
        error: () => this._snackBar.open('Impossible de supprimer le film', this.translate.instant('app.error'), { duration: DURATION }),
      }
    )
  }

}
