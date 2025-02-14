
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Movie, MovieActor, Person } from '../../models';
import { ActorService, MovieService } from '../../services';
import { CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from './components';

@Component({
  selector: 'app-add-movie',
  imports: [
    CastingFormComponent,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    TechnicalTeamFormComponent,
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {

  private _snackBar = inject(MatSnackBar);
  movie: Movie;
  duration = 5000;
  imageFile: File | null = null;

  actors$ = this.actorService.getAll();
  saveActor = (person: Person) => this.actorService.save(person);

  form = this.fb.group(
    {
      generalFormGroup: this.fb.group(
        {
          title: ['', Validators.required],
          originalTitle: [],
          synopsis: [],
          releaseDate: [],
          runningTime: [],
          budget: [],
          boxOffice: [],
          posterFileName: [],
          countries: [],
          genres: []
        }
      ),
      technicalTeamFormGroup: this.fb.group(
        {
          producers: [],
          directors: [],
          screenwriters: [],
          musicians: [],
          decorators: [],
          costumiers: [],
          photographers: [],
          editors: [],
          casters: [],
          artDirectors: [],
          soundEditors: [],
          visualEffectsSupervisors: [],
          makeupArtists: [],
          hairDressers: [],
          stuntmen: []
        }
      ),
      castingFormGroup: this.fb.group(
        {
          actors: this.fb.array<MovieActor>([])
        }
      )
    }
  );

  isLinear = true;

  constructor(
    private actorService: ActorService,
    private fb: FormBuilder,
    private movieService: MovieService
  ) { }

  selectImage(event: any) {
    this.imageFile = event;
  }

  saveMovie() {
    if (this.form.get('generalFormGroup').valid) {
      this.movieService.saveMovie(this.imageFile, this.form.get('generalFormGroup').value).subscribe(
        {
          next: result => {
            this._snackBar.open('Film créé avec succès', 'Done', { duration: this.duration });
            this.movie = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la création du film', 'Error', { duration: this.duration });
          }
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  saveTechnicalTeam() {
    if (this.form.get('technicalTeamFormGroup').valid) {
      this.movieService.saveTechnicalTeam(this.movie.id, this.form.get('technicalTeamFormGroup').value).subscribe(
        {
          next: result => {
            this._snackBar.open('Fiche technique ajoutée avec succès', 'Done', { duration: this.duration });
            this.movie.technicalTeam = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout de la fiche technique', 'Error', { duration: this.duration });
          }
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  saveCasting() {
    console.log(this.form.get('castingFormGroup.actors').value);

    if (this.form.get('castingFormGroup.actors').valid) {
      console.log(this.form.get('castingFormGroup.actors').value);

      this.movieService.saveCasting(this.movie.id, this.form.get('castingFormGroup.actors').value).subscribe(
        {
          next: result => {
            this._snackBar.open('Casting ajouté avec succès', 'Done', { duration: this.duration });
            this.movie.movieActors = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la modification du casting', 'Error', { duration: this.duration });
          }
        }
      )
    } else {
      console.error('Le formulaire est invalide');
    }
  }
}
