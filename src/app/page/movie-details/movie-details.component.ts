import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { concatMap, forkJoin, map, switchMap, tap } from 'rxjs';
import { MovieActor } from '../../models';
import { ActorService, MovieService } from '../../services';
import { CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from '../add-movie/components';

@Component({
  selector: 'app-movie-details',
  imports: [
    CastingFormComponent,
    DatePipe,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule,
    RouterLink,
    TechnicalTeamFormComponent,
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {

  private _snackBar = inject(MatSnackBar);
  private readonly duration = 5000;

  actors$ = this.actorService.getAll();
  form: FormGroup;
  generalInfosInitialValues: any;
  technicalTeamInitialValues: any;
  castingInitialValues: any;
  editGeneralInfos = false;
  editTechnicalTeam = false;
  editCasting = false;
  imageFile: File | null = null;
  movieActors: MovieActor[] = [];

  constructor(
    private actorService: ActorService,
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
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
            movieActors: this.movieService.getActors(id),
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
            hairDressers: this.movieService.getHairDressers(id),
            stuntmen: this.movieService.getStuntmen(id)
          }
        )
      ),
      tap(result => {
        this.generalInfosInitialValues = {
          id: [result.generalInfos.id],
          title: [result.generalInfos.title, Validators.required],
          originalTitle: [result.generalInfos.originalTitle],
          synopsis: [result.generalInfos.synopsis],
          releaseDate: [result.generalInfos.releaseDate],
          runningTime: [result.generalInfos.runningTime],
          budget: [result.generalInfos.budget],
          boxOffice: [result.generalInfos.boxOffice],
          posterFileName: [result.generalInfos.posterFileName],
          countries: [result.countries],
          genres: [result.genres]
        };
        this.technicalTeamInitialValues = {
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
          hairDressers: [result.hairDressers],
          stuntmen: [result.stuntmen]
        };
        this.movieActors = result.movieActors;
        this.castingInitialValues = {
          actors: this.fb.array(
            result.movieActors.map(a => this.fb.group(
              {
                id: [a.actor.id],
                name: [a.actor.name, Validators.required], // Nom de l'acteur
                role: [a.role, Validators.required]  // Rôle joué dans le film
              }
            ))
          )
        }
      }),
      map(result =>
        this.fb.group(
          {
            generalFormGroup: this.fb.group(this.generalInfosInitialValues),
            technicalTeamFormGroup: this.fb.group(this.technicalTeamInitialValues),
            castingFormGroup: this.fb.group(this.castingInitialValues)
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

  get posterFileName() {
    return this.form.controls['generalFormGroup'].get('posterFileName').value;
  }

  get countries() {
    return this.form.controls['generalFormGroup'].get('countries').value;
  }

  get genres() {
    return this.form.controls['generalFormGroup'].get('genres').value;
  }

  get producers() {
    return this.form.controls['technicalTeamFormGroup'].get('producers').value;
  }

  get directors() {
    return this.form.controls['technicalTeamFormGroup'].get('directors').value;
  }

  get screenwriters() {
    return this.form.controls['technicalTeamFormGroup'].get('screenwriters').value;
  }

  get musicians() {
    return this.form.controls['technicalTeamFormGroup'].get('musicians').value;
  }

  get decorators() {
    return this.form.controls['technicalTeamFormGroup'].get('decorators').value;
  }

  get costumiers() {
    return this.form.controls['technicalTeamFormGroup'].get('costumiers').value;
  }

  get photographers() {
    return this.form.controls['technicalTeamFormGroup'].get('photographers').value;
  }

  get editors() {
    return this.form.controls['technicalTeamFormGroup'].get('editors').value;
  }

  get casters() {
    return this.form.controls['technicalTeamFormGroup'].get('casters').value;
  }

  get artDirectors() {
    return this.form.controls['technicalTeamFormGroup'].get('artDirectors').value;
  }

  get soundEditors() {
    return this.form.controls['technicalTeamFormGroup'].get('soundEditors').value;
  }

  get visualEffectsSupervisors() {
    return this.form.controls['technicalTeamFormGroup'].get('visualEffectsSupervisors').value;
  }

  get makeupArtists() {
    return this.form.controls['technicalTeamFormGroup'].get('makeupArtists').value;
  }

  get hairDressers() {
    return this.form.controls['technicalTeamFormGroup'].get('hairDressers').value;
  }

  get stuntmen() {
    return this.form.controls['technicalTeamFormGroup'].get('stuntmen').value;
  }

  selectImage(event: any) {
    this.imageFile = event;
  }

  getSafePosterUrl(posterFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.movieService.getPosterUrl(posterFileName));
  }

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.actorService.getPhotoUrl(photoFileName));
  }

  cancelGeneralInfos() {
    this.editGeneralInfos = false;
    this.form.controls['generalFormGroup'].reset(this.generalInfosInitialValues);
  }

  cancelTechnicalTeam() {
    this.editTechnicalTeam = false;
    this.form.controls['technicalTeamFormGroup'].reset(this.technicalTeamInitialValues);
  }

  cancelCasting() {
    this.editCasting = false;
    this.form.controls['castingFormGroup'].patchValue(this.castingInitialValues);
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
    this.movieService.updateMovie(this.imageFile, this.form.value.generalFormGroup).pipe(
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
          this._snackBar.open('Film modifié avec succès', 'Done', { duration: this.duration });
          this.form.controls['generalFormGroup'].patchValue(result);
          this.editGeneralInfos = false;
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de la modification du film', 'Error', { duration: this.duration });
        },
        complete: () => this.editGeneralInfos = false
      }
    );
  }

  saveTechnicalTeam() {
    this.movieService.saveTechnicalTeam(this.id, this.form.get('technicalTeamFormGroup').value).subscribe(
      {
        next: result => {
          this._snackBar.open('Fiche technique modifiée avec succès', 'Done', { duration: this.duration });
          this.form.controls['technicalTeamFormGroup'].patchValue(result);
        },
        error: error => {
          console.error(error);
          this._snackBar.open('Erreur lors de la modification de la fiche technique', 'Error', { duration: this.duration });
        },
        complete: () => this.editTechnicalTeam = false
      }
    );
  }

  saveCasting() {
    if (this.form.get('castingFormGroup.actors').valid) {
      const body: MovieActor[] = this.form.get('castingFormGroup.actors').value.map(
        (ma: any) => (
          {
            id: this.movieActors.find(a => a.actor.id == ma.id)?.id,
            actor: { id: ma.id, name: ma.name },
            role: ma.role
          }
        )
      );

      this.movieService.saveCasting(this.id, body).subscribe(
        {
          next: result => {
            this._snackBar.open('Casting modifié avec succès', 'Done', { duration: this.duration });
            this.form.controls['castingFormGroup'].patchValue(result);
            this.movieActors = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la modification du casting', 'Error', { duration: this.duration });
          },
          complete: () => this.editCasting = false
        }
      )
    } else {
      console.error('Le formulaire est invalide');
    }
  }

}
