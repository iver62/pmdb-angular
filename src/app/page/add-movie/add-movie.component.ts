
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Award, Country, Genre, Movie, Person } from '../../models';
import { MovieService, PersonService } from '../../services';
import { AwardFormComponent, CountryFormComponent, GeneralInfosFormComponent, GenreFormComponent, PersonFormComponent, RoleFormComponent } from './components';

@Component({
  selector: 'app-add-movie',
  imports: [
    AwardFormComponent,
    CountryFormComponent,
    GeneralInfosFormComponent,
    GenreFormComponent,
    PersonFormComponent,
    RoleFormComponent,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {

  private _snackBar = inject(MatSnackBar);
  movie: Movie;
  durationInSeconds = 5;

  generalFormGroup = this.formBuilder.group(
    {
      titleCtrl: ['', Validators.required],
      originalTitleCtrl: [],
      synopsisCtrl: [],
      releaseDateCtrl: [],
      runningTimeCtrl: [],
      budgetCtrl: [],
      boxOfficeCtrl: [],
      posterCtrl: [],
    }
  );
  producersFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  directorsFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  screenwritersFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  musiciansFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  decoratorsFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  costumiersFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  photographersFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  editorsFormGroup = this.formBuilder.group({ personsCtrl: this.formBuilder.array([]) });
  genresFormGroup = this.formBuilder.group({ genresCtrl: this.formBuilder.array([]) });
  countriesFormGroup = this.formBuilder.group({ countriesCtrl: new FormControl([]) });
  awardsFormGroup = this.formBuilder.group({ awardsCtrl: this.formBuilder.array([]) });
  rolesFormGroup = this.formBuilder.group({ rolesCtrl: this.formBuilder.array([]) });

  isLinear = true;

  directors$ = this.personService.getDirectors();

  constructor(
    private formBuilder: FormBuilder,
    private movieService: MovieService,
    private personService: PersonService
  ) { }

  createMovie() {
    this.movieService.createMovie(
      {
        title: this.formValue.titleCtrl,
        originalTitle: this.formValue.originalTitleCtrl,
        synopsis: this.formValue.synopsisCtrl,
        releaseDate: this.formValue.releaseDateCtrl,
        runningTime: this.formValue.runningTimeCtrl,
        budget: this.formValue.budgetCtrl,
        boxOffice: this.formValue.boxOfficeCtrl
      }
    ).subscribe(
      {
        next: result => {
          this._snackBar.open('Film créé avec succès', 'Done', { duration: this.durationInSeconds * 1000 });
          this.movie = result;
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de la création du film', 'Error', { duration: this.durationInSeconds * 1000 });
        }
      }
    );
  }

  saveProducers() {
    if (this.producersFormValue.personsCtrl?.length) {
      this.movieService.saveProducers(this.movie.id, this.producersFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Producteurs ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des producteurs', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveDirectors() {
    if (this.directorsFormValue.personsCtrl?.length) {
      this.movieService.saveDirectors(this.movie.id, this.directorsFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Metteurs en scène ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des metteurs en scène', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveScreenwriters() {
    if (this.screewritersFormValue.personsCtrl?.length) {
      this.movieService.saveScreewriters(this.movie.id, this.screewritersFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Scénaristes ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des scénaristes', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveMusicians() {
    if (this.musiciansFormValue.personsCtrl?.length) {
      this.movieService.saveMusicians(this.movie.id, this.musiciansFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Musiciens ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des musiciens', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveDecorators() {
    if (this.decoratorsFormValue.personsCtrl?.length) {
      this.movieService.saveDecorators(this.movie.id, this.decoratorsFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Décorateurs ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des décorateurs', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveCostumiers() {
    if (this.costumiersFormValue.personsCtrl?.length) {
      this.movieService.saveCostumiers(this.movie.id, this.costumiersFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Costumiers ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des costumiers', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  savePhotographers() {
    if (this.photographersFormValue.personsCtrl?.length) {
      this.movieService.savePhotographers(this.movie.id, this.photographersFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Photographes ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des photographes', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveEditors() {
    if (this.editorsFormValue.personsCtrl?.length) {
      this.movieService.saveEditors(this.movie.id, this.editorsFormValue.personsCtrl).subscribe(
        {
          next: () => this._snackBar.open('Monteurs ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des monteurs', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveGenres() {
    console.log(this.genresFormValue.genresCtrl);

    if (this.genresFormValue.genresCtrl?.length) {
      this.movieService.saveGenres(this.movie.id, this.genresFormValue.genresCtrl).subscribe(
        {
          next: () => this._snackBar.open('Genres ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des genres', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveCountries() {
    if (this.countriesFormValue.countriesCtrl?.length) {
      this.movieService.saveCountries(this.movie.id, this.countriesFormValue.countriesCtrl).subscribe(
        {
          next: () => this._snackBar.open('Pays ajoutés avec succès', 'Done', { duration: this.durationInSeconds * 1000 }),
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de l\'ajout des pays', 'Error', { duration: this.durationInSeconds * 1000 });
          }
        }
      );
    }
  }

  saveAwards() {
    this.movieService.saveAwards(this.movie.id, this.awardsFormValue.awardsCtrl).subscribe(result => {
      this._snackBar.open('Récompenses ajoutées avec succès', 'Done', {
        duration: this.durationInSeconds * 1000,
      });
    });
  }

  removeProducer(person: Person) {
    this.movieService.removeProducer(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeDirector(person: Person) {
    this.movieService.removeDirector(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeScreenwriter(person: Person) {
    this.movieService.removeScreenwriter(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeMusician(person: Person) {
    this.movieService.removeMusician(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeDecorator(person: Person) {
    this.movieService.removeDecorator(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeCostumier(person: Person) {
    this.movieService.removeCostumier(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removePhotographer(person: Person) {
    this.movieService.removePhotographer(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeEditor(person: Person) {
    this.movieService.removeEditor(this.movie.id, person.id).subscribe(result => console.log(result));
  }

  removeGenre(genre: Genre) {
    this.movieService.removeGenre(this.movie.id, genre.id).subscribe(result => console.log(result));
  }

  removeCountry(country: Country) {
    this.movieService.removeCountry(this.movie.id, country.id).subscribe(result => console.log(result));
  }

  removeAward(award: Award) {
    this.movieService.removeAward(this.movie.id, award.id).subscribe(result => console.log(result));
  }

  deleteMovie() {
    this.movieService.deleteMovie(this.movie.id).subscribe(result => console.log(result));
  }

  get formValue() {
    return this.generalFormGroup.value;
  }

  get producersFormValue() {
    return this.producersFormGroup.value;
  }

  get directorsFormValue() {
    return this.directorsFormGroup.value;
  }

  get screewritersFormValue() {
    return this.screenwritersFormGroup.value;
  }

  get musiciansFormValue() {
    return this.musiciansFormGroup.value;
  }

  get decoratorsFormValue() {
    return this.decoratorsFormGroup.value;
  }

  get costumiersFormValue() {
    return this.costumiersFormGroup.value;
  }

  get photographersFormValue() {
    return this.photographersFormGroup.value;
  }

  get editorsFormValue() {
    return this.editorsFormGroup.value;
  }

  get genresFormValue() {
    return this.genresFormGroup.value;
  }

  get countriesFormValue() {
    return this.countriesFormGroup.value;
  }

  get awardsFormValue() {
    return this.awardsFormGroup.value;
  }
}
