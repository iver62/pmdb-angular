import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { concatMap, forkJoin, map, switchMap } from 'rxjs';
import { MovieService } from '../../services';
import { GeneralInfosFormComponent, TechnicalSummaryFormComponent } from '../add-movie/components';

@Component({
  selector: 'app-movie-details',
  imports: [
    DatePipe,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule,
    RouterLink,
    TechnicalSummaryFormComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {

  private _snackBar = inject(MatSnackBar);
  private readonly durationInSeconds = 5;

  form: FormGroup;
  editGeneralInfos = false;
  editTechnicalSummary = false;
  editCasting = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id =>
        forkJoin(
          {
            generalInfos: this.movieService.getOne(id),
            genres: this.movieService.getGenres(id),
            countries: this.movieService.getCountries(id),
            producers: this.movieService.getProducers(id),
            directors: this.movieService.getDirectors(id),
            screenwriters: this.movieService.getScreenwriters(id),
            musicians: this.movieService.getMusicians(id),
            photographers: this.movieService.getPhotographers(id),
            costumiers: this.movieService.getCostumiers(id),
            decorators: this.movieService.getDecorators(id),
            editors: this.movieService.getEditors(id),
            casters: this.movieService.getCasters(id),
            artDirectors: this.movieService.getArtDirectors(id),
            soundEditors: this.movieService.getSoundEditors(id),
            visualEffectsSupervisors: this.movieService.getVisualEffectsSupervisors(id),
            makeupArtists: this.movieService.getMakeupArtists(id),
            hairDressers: this.movieService.getHairDressers(id)
          }
        )
      ),
      map(
        result => this.fb.group(
          {
            generalFormGroup: this.fb.group(
              {
                id: [result.generalInfos.id],
                title: [result.generalInfos.title, Validators.required],
                originalTitle: [result.generalInfos.originalTitle],
                synopsis: [result.generalInfos.synopsis],
                releaseDate: [result.generalInfos.releaseDate],
                runningTime: [result.generalInfos.runningTime],
                budget: [result.generalInfos.budget],
                boxOffice: [result.generalInfos.boxOffice],
                poster: [result.generalInfos.posterPath],
                countries: [result.countries],
                genres: [result.genres]
              }
            ),
            technicalSummaryFormGroup: this.fb.group(
              {
                producers: [result.producers],
                directors: [result.directors],
                screenwriters: [result.screenwriters],
                musicians: [result.musicians],
                decorators: [result.decorators],
                costumiers: [result.costumiers],
                photographers: [result.photographers],
                editors: [result.editors],
                casters: [result.casters],
                artDirectors: [result.artDirectors],
                soundEditors: [result.soundEditors],
                visualEffectsSupervisors: [result.visualEffectsSupervisors],
                makeupArtists: [result.makeupArtists],
                hairDressers: [result.hairDressers]
              }
            ),
            castingFormGroup: this.fb.group(
              {

              }
            )
          }
        )
      )
    ).subscribe(result => this.form = result);
  }

  get id() {
    return this.form.controls['generalFormGroup'].get('id').value;
  }

  get title() {
    return this.form.controls['generalFormGroup'].get('title').value;
  }

  get originalTitle() {
    return this.form.controls['generalFormGroup'].get('originalTitle').value;
  }

  get synopsis() {
    return this.form.controls['generalFormGroup'].get('synopsis').value;
  }

  get releaseDate() {
    return this.form.controls['generalFormGroup'].get('releaseDate').value;
  }

  get runningTime() {
    return this.form.controls['generalFormGroup'].get('runningTime').value;
  }

  get budget() {
    return this.form.controls['generalFormGroup'].get('budget').value;
  }

  get boxOffice() {
    return this.form.controls['generalFormGroup'].get('boxOffice').value;
  }

  get poster() {
    return this.form.controls['generalFormGroup'].get('poster').value;
  }

  get countries() {
    return this.form.controls['generalFormGroup'].get('countries').value;
  }

  get genres() {
    return this.form.controls['generalFormGroup'].get('genres').value;
  }

  get producers() {
    return this.form.controls['technicalSummaryFormGroup'].get('producers').value;
  }

  get directors() {
    return this.form.controls['technicalSummaryFormGroup'].get('directors').value;
  }

  get screenwriters() {
    return this.form.controls['technicalSummaryFormGroup'].get('screenwriters').value;
  }

  get musicians() {
    return this.form.controls['technicalSummaryFormGroup'].get('musicians').value;
  }

  get decorators() {
    return this.form.controls['technicalSummaryFormGroup'].get('decorators').value;
  }

  get costumiers() {
    return this.form.controls['technicalSummaryFormGroup'].get('costumiers').value;
  }

  get photographers() {
    return this.form.controls['technicalSummaryFormGroup'].get('photographers').value;
  }

  get editors() {
    return this.form.controls['technicalSummaryFormGroup'].get('editors').value;
  }

  get casters() {
    return this.form.controls['technicalSummaryFormGroup'].get('casters').value;
  }

  get artDirectors() {
    return this.form.controls['technicalSummaryFormGroup'].get('artDirectors').value;
  }

  get soundEditors() {
    return this.form.controls['technicalSummaryFormGroup'].get('soundEditors').value;
  }

  get visualEffectsSupervisors() {
    return this.form.controls['technicalSummaryFormGroup'].get('visualEffectsSupervisors').value;
  }

  get makeupArtists() {
    return this.form.controls['technicalSummaryFormGroup'].get('makeupArtists').value;
  }

  get hairDressers() {
    return this.form.controls['technicalSummaryFormGroup'].get('hairDressers').value;
  }

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

  saveGeneralInfos() {
    this.movieService.updateMovie(this.form.value.generalFormGroup).pipe(
      concatMap(movie =>
        this.movieService.getCountries(movie.id).pipe(
          map(countries => ({ ...movie, countries: countries }))
        )
      ),
      concatMap(movie =>
        this.movieService.getGenres(movie.id).pipe(
          map(genres => ({ ...movie, genres: genres }))
        )
      )
    ).subscribe(
      {
        next: result => {
          this._snackBar.open('Film modifié avec succès', 'Done', { duration: this.durationInSeconds * 1000 });
          this.form.controls['generalFormGroup'].patchValue(result);
          this.editGeneralInfos = false;
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de la modification du film', 'Error', { duration: this.durationInSeconds * 1000 });
        },
        complete: () => this.editGeneralInfos = false
      }
    );
  }

  saveTechnicalSummary() {
    this.movieService.saveTechnicalSummay(this.id, this.form.get('technicalSummaryFormGroup').value).subscribe(
      {
        next: result => {
          this._snackBar.open('Fiche technique modifiée avec succès', 'Done', { duration: this.durationInSeconds * 1000 });
          this.form.controls['technicalSummaryFormGroup'].patchValue(result);
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de la modification de la fiche technique', 'Error', { duration: this.durationInSeconds * 1000 });
        },
        complete: () => this.editTechnicalSummary = false
      }
    );
  }

}
