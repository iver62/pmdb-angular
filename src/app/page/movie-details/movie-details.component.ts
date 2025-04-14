import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { Award, Movie, MovieActor, TechnicalTeam } from '../../models';
import { MovieService } from '../../services';
import { AwardsFormComponent, CastingFormComponent, GeneralInfosFormComponent, TechnicalTeamFormComponent } from '../add-movie/components';
import { AwardsComponent, CastingComponent, MovieDetailComponent, TechnicalTeamComponent } from './components';

@Component({
  selector: 'app-movie-details',
  imports: [
    AwardsComponent,
    AwardsFormComponent,
    CastingComponent,
    CastingFormComponent,
    GeneralInfosFormComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MovieDetailComponent,
    ReactiveFormsModule,
    RouterLink,
    TechnicalTeamFormComponent,
    TechnicalTeamComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {

  private _snackBar = inject(MatSnackBar);
  private readonly duration = 5000;

  private selectedTab$ = new BehaviorSubject<number>(0);

  generalInfos: Movie;
  technicalTeam: TechnicalTeam;
  casting: MovieActor[];
  awards: Award[];

  id: number;
  generalInfosForm: FormGroup;
  technicalTeamForm: FormGroup;
  castingForm: FormGroup;
  awardsForm: FormGroup;

  generalInfosFormInitialValues: any;
  technicalTeamInitialValues: any;
  castingInitialValues: { actors: FormArray };
  awardsInitialValues: { awards: FormArray };

  editGeneralInfos = false;
  editTechnicalTeam = false;
  editCasting = false;
  editAwards = false;

  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => +params.get('id')),
      tap(id => this.id = id),
      switchMap(id => {
        if (!id) return of(null);
        return this.selectedTab$.pipe(
          distinctUntilChanged(),
          switchMap(tabIndex => {
            if (tabIndex === 0) return this.movieService.getOne(id).pipe(map(res => ({ type: 'movie', data: res })));
            if (tabIndex === 1) return this.movieService.getTechnicalTeam(id).pipe(map(res => ({ type: 'team', data: res })));
            if (tabIndex === 2) return this.movieService.getActors(id).pipe(map(res => ({ type: 'actors', data: res || [] })));
            if (tabIndex === 3) return this.movieService.getAwards(id).pipe(map(res => ({ type: 'awards', data: res || [] })));
            return of(null);
          })
        );
      })
    ).subscribe(result => {
      if (!result) return;

      switch (result.type) {
        case 'movie':
          this.generalInfos = result.data as Movie;
          this.initGeneralInfosForm();
          break;
        case 'team':
          this.technicalTeam = result.data as TechnicalTeam;
          this.initTechnicalTeamForm();
          break;
        case 'actors':
          this.casting = result.data as MovieActor[];
          this.initCastingForm();
          break;
        case 'awards':
          this.awards = result.data as Award[];
          this.initAwardsForm();
          break;
      }
    });
  }

  private initGeneralInfosForm() {
    if (!this.generalInfos) return;

    this.generalInfosFormInitialValues = {
      id: [this.generalInfos.id],
      title: [this.generalInfos.title, Validators.required],
      originalTitle: [this.generalInfos.originalTitle],
      synopsis: [this.generalInfos.synopsis],
      releaseDate: [this.generalInfos.releaseDate],
      runningTime: [this.generalInfos.runningTime],
      budget: [this.generalInfos.budget],
      boxOffice: [this.generalInfos.boxOffice],
      posterFileName: [this.generalInfos.posterFileName],
      countries: [this.generalInfos.countries],
      genres: [this.generalInfos.genres],
      user: [this.generalInfos.user]
    };

    if (!this.generalInfosForm) {
      this.generalInfosForm = this.fb.group(this.generalInfosFormInitialValues);
    } else {
      this.generalInfosForm.patchValue(this.generalInfosFormInitialValues);
    }
  }

  private compare(a: Award, b: Award) {
    return a.ceremony.localeCompare(b.ceremony) || a.name.localeCompare(b.name);
  }

  private initTechnicalTeamForm() {
    if (!this.technicalTeam) return;

    this.technicalTeamInitialValues = {
      producers: [this.technicalTeam.producers],
      directors: [this.technicalTeam.directors],
      screenwriters: [this.technicalTeam.screenwriters],
      musicians: [this.technicalTeam.musicians],
      decorators: [this.technicalTeam.decorators],
      costumiers: [this.technicalTeam.costumiers],
      photographers: [this.technicalTeam.photographers],
      editors: [this.technicalTeam.editors],
      casters: [this.technicalTeam.casters],
      artDirectors: [this.technicalTeam.artDirectors],
      soundEditors: [this.technicalTeam.soundEditors],
      visualEffectsSupervisors: [this.technicalTeam.visualEffectsSupervisors],
      makeupArtists: [this.technicalTeam.makeupArtists],
      hairDressers: [this.technicalTeam.hairDressers],
      stuntmen: [this.technicalTeam.stuntmen]
    };

    if (!this.technicalTeamForm) {
      this.technicalTeamForm = this.fb.group(this.technicalTeamInitialValues);
    } else {
      this.technicalTeamForm.patchValue(this.technicalTeamInitialValues);
    }
  }

  private initCastingForm() {
    if (!this.casting) return;

    this.castingInitialValues = {
      actors: this.fb.array(
        this.casting.map(actor =>
          this.fb.group({
            id: [actor.actor.id],
            name: [actor.actor.name, Validators.required], // Nom de l'acteur
            role: [actor.role, Validators.required], // Rôle joué dans le film
          })
        )
      )
    };

    if (!this.castingForm) {
      this.castingForm = this.fb.group(this.castingInitialValues);
    } else {
      this.castingForm.patchValue(this.castingInitialValues.actors);
    }
  }

  private initAwardsForm() {
    // if (!this.awards) return;

    this.awardsInitialValues = {
      awards: this.fb.array(
        this.awards
          .sort(this.compare)
          .map(award =>
            this.fb.group({
              id: [award.id],
              ceremony: [award.ceremony, Validators.required], // Cérémonie de la récompense
              name: [award.name, Validators.required], // Nom de la récompense
              year: [award.year], // Année de la récompense
            })
          )
      ),
    };

    if (!this.awardsForm) {
      this.awardsForm = this.fb.group(this.awardsInitialValues);

    } else {
      this.awardsForm.patchValue(this.awardsInitialValues.awards);
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTab$.next(event.index);
  }

  selectImage(event: any) {
    this.imageFile = event;
  }

  cancelGeneralInfos() {
    this.editGeneralInfos = false;
    this.generalInfosForm.patchValue(this.generalInfosFormInitialValues);
  }

  cancelTechnicalTeam() {
    this.editTechnicalTeam = false;
    this.technicalTeamForm.patchValue(this.technicalTeamInitialValues);
  }

  cancelCasting() {
    this.editCasting = false;
    this.castingForm.patchValue(this.castingInitialValues);
  }

  cancelAwards() {
    this.editAwards = false;
    this.awardsForm.patchValue(this.awardsInitialValues);
  }

  saveGeneralInfos() {
    if (this.generalInfosForm.valid) {
      this.movieService.updateMovie(this.imageFile, this.generalInfosForm.value).subscribe(
        {
          next: result => {
            this.generalInfos = result;
            this.generalInfosFormInitialValues = result;
            this.generalInfosForm.patchValue(result); // TODO: recréer un nouvel objet
            this._snackBar.open('Film modifié avec succès', 'Done', { duration: this.duration })
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la modification du film', 'Error', { duration: this.duration });
          },
          complete: () => this.editGeneralInfos = false
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  saveTechnicalTeam() {
    if (this.technicalTeamForm.valid) {
      this.movieService.saveTechnicalTeam(this.id, this.technicalTeamForm.value).subscribe(
        {
          next: result => {
            this.technicalTeam = result;
            this.technicalTeamForm.patchValue(result); // TODO: recréer un nouvel objet
            this._snackBar.open('Fiche technique modifiée avec succès', 'Done', { duration: this.duration });
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la modification de la fiche technique', 'Error', { duration: this.duration });
          },
          complete: () => this.editTechnicalTeam = false
        }
      );
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  saveCasting() {
    if (this.castingForm.valid) {
      const body: MovieActor[] = this.castingForm.value['actors'].map(
        (ma: any, index: number) => (
          {
            id: this.casting.find(a => a.actor.id == ma.id)?.id ?? null,
            actor: { id: ma.id, name: ma.name },
            role: ma.role,
            rank: index
          }
        )
      );

      this.movieService.saveCasting(this.id, body).subscribe(
        {
          next: result => {
            this._snackBar.open('Casting modifié avec succès', 'Done', { duration: this.duration });
            this.castingForm.patchValue(result); // TODO: recréer un nouvel objet
            this.casting = result;
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

  saveAwards() {
    if (this.awardsForm.valid) {
      this.movieService.saveAwards(this.id, this.awardsForm.value['awards']).subscribe(
        {
          next: result => {
            this._snackBar.open('Récompenses modifiées avec succès', 'Done', { duration: this.duration });
            this.awardsForm.patchValue(result); // TODO: recréer un nouvel objet
            this.awards = result;
          },
          error: error => {
            console.error(error);
            this._snackBar.open('Erreur lors de la modification des récompenses', 'Error', { duration: this.duration });
          },
          complete: () => this.editAwards = false
        }
      )
    } else {
      this._snackBar.open('Le formulaire est invalide', 'Error', { duration: this.duration });
    }
  }
}
