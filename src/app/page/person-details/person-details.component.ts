import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { catchError, concatMap, forkJoin, map, of, switchMap } from 'rxjs';
import { CountrySelectorComponent, MoviesListComponent } from '../../components';
import { Person } from '../../models';
import { BaseService } from '../../services';

@Component({
  selector: 'app-person-details',
  imports: [
    CountrySelectorComponent,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MoviesListComponent,
    NgPipesModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css'
})
export class PersonDetailsComponent {

  durationInSeconds = 5;
  service: BaseService = this.route.snapshot.data['service'];
  person = signal<Person>(null);
  age = computed(() => new Date().getFullYear() - new Date(this.person().dateOfBirth)?.getFullYear());
  ageOfDeath = computed(() => new Date(this.person().dateOfDeath)?.getFullYear() - new Date(this.person().dateOfBirth)?.getFullYear());
  editMode = false;
  form: FormGroup;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => this.service.get(+params.get('id')).pipe(
        concatMap(p =>
          forkJoin(
            {
              movies: this.service.getMovies(p),
              countries: this.service.getCountries(p)
            }
          ).pipe(
            map(result => (
              {
                ...p,
                movies: result.movies,
                countries: result.countries
              }
            )
            )
          )
        ),
        catchError(error => {
          console.error('Erreur lors de la récupération des films:', error);
          return of(null); // Retourne un observable avec null en cas d'erreur
        })
      )),
      catchError(error => {
        console.error('Erreur lors de la récupération de la personne:', error);
        return of(null); // Retourne un observable avec null en cas d'erreur
      })
    ).subscribe(result => {
      this.person.set(result);
      this.form = this.fb.group(
        {
          id: [this.person().id],
          name: [this.person().name, Validators.required],
          dateOfBirth: [this.person().dateOfBirth],
          dateOfDeath: [this.person().dateOfDeath],
          photoFileName: [this.person().photoFileName],
          countries: [this.person().countries]
        }
      )
    });
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.photoFormCtrl.setValue(this.selectedFileName);
    }
  }

  deleteFile() {
    this.photoFormCtrl.reset();
  }

  get photoFormCtrl() {
    return this.form.get('photoFileName');
  }

  getSafePhotoUrl() {
    return this.sanitizer.bypassSecurityTrustUrl(this.service.getPhotoUrl(this.person()?.photoFileName));
  }

  cancel() {
    this.editMode = false;
    this.form.patchValue(
      {
        name: this.person().name,
        photoFileName: this.person().photoFileName,
        dateOfBirth: this.person().dateOfBirth,
        dateOfDeath: this.person().dateOfDeath,
        countries: this.person().countries
      }
    );
  }

  save() {
    console.log(this.form.value);

    this.service.update(this.selectedFile, { ...this.form.value, creationDate: this.person().creationDate }).pipe(
      concatMap(person => this.service.getCountries(person).pipe(
        map(countries => (
          {
            ...person,
            countries: countries
          }
        ))
      ))
    ).subscribe(
      {
        next: (result: Person) => {
          console.log('RESULT', result);

          this.person.update(current => ({
            ...current,
            name: result.name,
            photoFileName: result.photoFileName,
            dateOfBirth: result.dateOfBirth,
            dateOfDeath: result.dateOfDeath,
            countries: result.countries
          }));
          this.editMode = false;
          this.snackBar.open(`${this.person().name} modifié avec succès`, 'Done', { duration: this.durationInSeconds * 1000 });
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(`Erreur lors de la modification de ${this.person().name}`, 'Error', { duration: this.durationInSeconds * 1000 });
        }
      }
    );
  }

  delete() {
    this.service.delete(this.person().id).subscribe(
      {
        next: (result: boolean) => {
          this.snackBar.open(`${this.person.name} supprimé avec succès`, 'Done', { duration: this.durationInSeconds * 1000 });
          this.router.navigateByUrl(this.route.snapshot.url.at(0)?.path);
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(`Erreur lors de la suppression de ${this.person().name}`, 'Error', { duration: this.durationInSeconds * 1000 });
        }
      }
    );
  }

}
