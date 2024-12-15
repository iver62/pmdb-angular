import { AsyncPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Movie } from '../../../models';
import { MovieService } from '../../../services';
import { GeneralInfosComponent } from './components/general-infos/general-infos.component';

@Component({
  selector: 'app-movie-detail',
  imports: [AsyncPipe, DatePipe, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule, MatTabsModule, MatTooltipModule, NgPipesModule, NgTemplateOutlet, ReactiveFormsModule, RouterLink, GeneralInfosComponent],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {

  private _snackBar = inject(MatSnackBar);

  techniciansForm = this.fb.group(
    {
      producersCtrl: this.fb.array([]),
      directorsCtrl: this.fb.array([]),
      screenwritersCtrl: this.fb.array([]),
      musiciansCtrl: this.fb.array([]),
      decoratorsCtrl: this.fb.array([]),
      costumiersCtrl: this.fb.array([]),
      photographersCtrl: this.fb.array([]),
      editorsCtrl: this.fb.array([])
    }
  )
  castingForm = this.fb.group(
    {}
  );

  movie$: Observable<Movie> = this.route.paramMap.pipe(
    switchMap(params =>
      forkJoin(
        {
          generalInfos: this.movieService.getOne(Number(params.get('id'))),
          genres: this.movieService.getGenres(Number(params.get('id'))),
          countries: this.movieService.getCountries(Number(params.get('id'))),
          producers: this.movieService.getProducers(Number(params.get('id'))),
          directors: this.movieService.getDirectors(Number(params.get('id'))),
          screenwriters: this.movieService.getScreenwriters(Number(params.get('id'))),
          musicians: this.movieService.getMusicians(Number(params.get('id'))),
          photographers: this.movieService.getPhotographers(Number(params.get('id'))),
          costumiers: this.movieService.getCostumiers(Number(params.get('id'))),
          decorators: this.movieService.getDecorators(Number(params.get('id'))),
          editors: this.movieService.getEditors(Number(params.get('id')))
        }
      )
    ), map(
      result => (
        {
          id: result.generalInfos.id,
          title: result.generalInfos.title,
          originalTitle: result.generalInfos.originalTitle,
          synopsis: result.generalInfos.synopsis,
          releaseDate: result.generalInfos.releaseDate,
          runningTime: result.generalInfos.runningTime,
          budget: result.generalInfos.budget,
          boxOffice: result.generalInfos.boxOffice,
          creationDate: result.generalInfos.creationDate,
          lastUpdate: result.generalInfos.lastUpdate,
          producers: result.producers,
          directors: result.directors,
          screenwriters: result.screenwriters,
          musicians: result.musicians,
          photographers: result.photographers,
          costumiers: result.costumiers,
          decorators: result.decorators,
          editors: result.editors,
          genres: result.genres,
          countries: result.countries
        }
      )
    )
  );

  editGeneralInfos = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe(
      {
        next: () => {
          this._snackBar.open('Film supprimé avec succès', 'Done', { duration: 5000 });
          this.router.navigateByUrl('/movies');
        },
        error: () => this._snackBar.open('Erreur lors de la suppression du film', 'Error', { duration: 5000 })
      }
    )
  }

  saveGeneralInfos(event: any) {
    console.log('SUBMIT GENERAL INFOS', event);
    this.editGeneralInfos = false;
  }



}
