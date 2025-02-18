import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgPipesModule } from 'ngx-pipes';
import { BehaviorSubject, catchError, combineLatest, filter, map, of, scan, Subject, switchMap, tap } from 'rxjs';
import { MoviesListComponent, PersonsListComponent } from '../../components';
import { DelayedInputDirective } from '../../directives';
import { Movie, Person, SearchConfig } from '../../models';
import { ActorService, ArtDirectorService, CasterService, CostumierService, CountryService, DecoratorService, DirectorService, EditorService, HairDresserService, MakeupArtistService, MusicianService, PhotographerService, ProducerService, ScreenwriterService, SoundEditorService, StuntmanService, VisualEffectSupervisorsService } from '../../services';
import { PersonUtils } from '../../utils/person.utils';

const INITIAL_CONFIG: SearchConfig = {
  page: 0,
  size: 20,
  sort: 'name',
  direction: 'Ascending',
  term: ''
}

@Component({
  selector: 'app-country-details',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
    InfiniteScrollDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MoviesListComponent,
    NgPipesModule,
    RouterLink,
    PersonsListComponent
  ],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss'
})
export class CountryDetailsComponent {

  totalFilms: number;

  private selectedTab$ = new BehaviorSubject<number>(0);

  totalActors$ = new Subject<number>();
  totalDirectors$ = new Subject<number>();
  totalScreenwriters$ = new Subject<number>();
  totalMusicians$ = new Subject<number>();
  totalDecorators$ = new Subject<number>();
  totalCostumiers$ = new Subject<number>();
  totalPhotographers$ = new Subject<number>();
  totalEditors$ = new Subject<number>();
  totalCasters$ = new Subject<number>();
  totalArtDirectors$ = new Subject<number>();
  totalSoundEditors$ = new Subject<number>();
  totalVisualEffectsSupervisors$ = new Subject<number>();
  totalMakeupArtists$ = new Subject<number>();
  totalHairDressers$ = new Subject<number>();
  totalStuntmen$ = new Subject<number>();
  totalProducers$ = new Subject<number>();

  searchMoviesConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchActorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchDirectorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchScreenwritersConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchMusiciansConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchDecoratorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchCostumiersConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchPhotographersConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchEditorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchCastersConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchArtDirectorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchSoundEditorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchVisualEffectsSupervisorsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchMakeupArtistsConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchHairDressersConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchStuntmenConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);
  searchProducersConfig$ = new BehaviorSubject<SearchConfig>(INITIAL_CONFIG);

  private readonly configMap = new Map<number, BehaviorSubject<SearchConfig>>([
    [0, this.searchMoviesConfig$],                      // Films
    [1, this.searchActorsConfig$],                      // Acteurs
    [2, this.searchDirectorsConfig$],                   // Réalisateurs
    [3, this.searchScreenwritersConfig$],               // Scénaristes
    [4, this.searchMusiciansConfig$],                   // Musiciens
    [5, this.searchDecoratorsConfig$],                  // Décorateurs
    [6, this.searchCostumiersConfig$],                  // Costumiers
    [7, this.searchPhotographersConfig$],               // Photographes
    [8, this.searchEditorsConfig$],                     // Monteurs
    [9, this.searchCastersConfig$],                     // Casteurs
    [10, this.searchArtDirectorsConfig$],               // Directeurs artistiques
    [11, this.searchSoundEditorsConfig$],               // Ingénieurs du son
    [12, this.searchVisualEffectsSupervisorsConfig$],   // Spécialistes effets spéciaux
    [13, this.searchMakeupArtistsConfig$],              // Maquilleurs
    [14, this.searchHairDressersConfig$],               // Coiffeurs
    [15, this.searchStuntmenConfig$],                   // Cascadeurs
    [16, this.searchProducersConfig$]                   // Producteurs
  ]);

  movies$ = combineLatest([this.searchMoviesConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 0), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getMoviesByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalFilms = +(response.headers.get('X-Total-Count') ?? 0)),
        map(response =>
          (response.body ?? []).map(m => (
            {
              id: m.id,
              title: m.title,
              releaseDate: m.releaseDate,
              posterFileName: m.posterFileName
            }
          ))
        ),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Movie[], result: Movie[]) => this.searchMoviesConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux films
  );

  actors$ = combineLatest([this.searchActorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 1), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getActorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalActors$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchActorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux acteurs
  );

  directors$ = combineLatest([this.searchDirectorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 2), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getDirectorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalDirectors$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchDirectorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux réalisateurs
  );

  screenwriters$ = combineLatest([this.searchScreenwritersConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 3), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getScreenwritersByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalScreenwriters$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchScreenwritersConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux scénaristes
  );

  musicians$ = combineLatest([this.searchMusiciansConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 4), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getMusiciansByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalMusicians$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchMusiciansConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux musiciens
  );

  decorators$ = combineLatest([this.searchDecoratorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 5), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getDecoratorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalDecorators$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchDecoratorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux décorateurs
  );

  costumiers$ = combineLatest([this.searchCostumiersConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 6), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getCostumiersByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalCostumiers$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchCostumiersConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux costumiers
  );

  photographers$ = combineLatest([this.searchPhotographersConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 7), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getPhotographersByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalPhotographers$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchPhotographersConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux photographes
  );

  editors$ = combineLatest([this.searchEditorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 8), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getEditorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalEditors$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchEditorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux monteurs
  );

  casters$ = combineLatest([this.searchCastersConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 9), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getCastersByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalCasters$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchCastersConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  artDirectors$ = combineLatest([this.searchArtDirectorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 10), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getArtDirectorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalArtDirectors$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchArtDirectorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  soundEditors$ = combineLatest([this.searchSoundEditorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 11), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getSoundEditorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalSoundEditors$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchSoundEditorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  visualEffectsSupervisors$ = combineLatest([this.searchVisualEffectsSupervisorsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 12), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getVisualEffectsSupervisorsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalVisualEffectsSupervisors$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchVisualEffectsSupervisorsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  makeupArtists$ = combineLatest([this.searchMakeupArtistsConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 13), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getMakeupArtistsByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalMakeupArtists$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchMakeupArtistsConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  hairDressers$ = combineLatest([this.searchHairDressersConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 14), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getHairDressersByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalHairDressers$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchHairDressersConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  stuntmen$ = combineLatest([this.searchStuntmenConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 15), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getStuntmenByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalStuntmen$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchStuntmenConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux casteurs
  );

  producers$ = combineLatest([this.searchProducersConfig$, this.route.paramMap, this.selectedTab$]).pipe(
    filter(([_, params, tabIndex]) => !!params.get('id') && tabIndex == 16), // Ignore si l'id est null
    switchMap(([config, params]) =>
      this.countryService.getProducersByCountry(+params.get('id'), config.page, config.size, config.term).pipe(
        tap(response => this.totalProducers$.next(+(response.headers.get('X-Total-Count') ?? 0))),
        map(response => (response.body ?? []).map(p => PersonUtils.toLightPerson(p))),
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    ),
    scan((acc: Person[], result: Person[]) => this.searchProducersConfig$.value.page == 0 ? result : acc.concat(result), []), // Concatène les nouveaux producteurs
  );

  countryName = this.router.getCurrentNavigation().extras.state['name'];
  personTabs = [
    {
      label: 'Acteurs',
      total$: this.totalActors$,
      config$: this.searchActorsConfig$,
      data$: this.actors$,
      service: this.actorService,
      route: '/actors'
    },
    {
      label: 'Réalisateurs',
      total$: this.totalDirectors$,
      config$: this.searchDirectorsConfig$,
      data$: this.directors$,
      service: this.directorService,
      route: '/directors'
    },
    {
      label: 'Scénaristes',
      total$: this.totalScreenwriters$,
      config$: this.searchScreenwritersConfig$,
      data$: this.screenwriters$,
      service: this.screenwriterService,
      route: '/screenwriters'
    },
    {
      label: 'Musiciens',
      total$: this.totalMusicians$,
      config$: this.searchMusiciansConfig$,
      data$: this.musicians$,
      service: this.musicianService,
      route: '/musicians'
    },
    {
      label: 'Décorateurs',
      total$: this.totalDecorators$,
      config$: this.searchDecoratorsConfig$,
      data$: this.decorators$,
      service: this.decoratorService,
      route: '/decorators'
    },
    {
      label: 'Costumiers',
      total$: this.totalCostumiers$,
      config$: this.searchCostumiersConfig$,
      data$: this.costumiers$,
      service: this.costumierService,
      route: '/costumiers'
    },
    {
      label: 'Photographes',
      total$: this.totalPhotographers$,
      config$: this.searchPhotographersConfig$,
      data$: this.photographers$,
      service: this.photographerService,
      route: '/photographers'
    },
    {
      label: 'Monteurs',
      total$: this.totalEditors$,
      config$: this.searchEditorsConfig$,
      data$: this.editors$,
      service: this.editorService,
      route: '/editors'
    },
    {
      label: 'Casteurs',
      total$: this.totalCasters$,
      config$: this.searchCastersConfig$,
      data$: this.casters$,
      service: this.casterService,
      route: '/casters'
    },
    {
      label: 'Directeurs artistiques',
      total$: this.totalArtDirectors$,
      config$: this.searchArtDirectorsConfig$,
      data$: this.artDirectors$,
      service: this.artDirectorService,
      route: '/art-directors'
    },
    {
      label: 'Ingénieurs du son',
      total$: this.totalSoundEditors$,
      config$: this.searchSoundEditorsConfig$,
      data$: this.soundEditors$,
      service: this.soundEditorService,
      route: '/sound-editors'
    },
    {
      label: 'Spécialistes effets spéciaux',
      total$: this.totalVisualEffectsSupervisors$,
      config$: this.searchVisualEffectsSupervisorsConfig$,
      data$: this.visualEffectsSupervisors$,
      service: this.visualEffectsSupervisorService,
      route: '/visual-effects-supervisors'
    },
    {
      label: 'Maquilleurs',
      total$: this.totalMakeupArtists$,
      config$: this.searchMakeupArtistsConfig$,
      data$: this.makeupArtists$,
      service: this.makeupArtistService,
      route: '/makeup-artists'
    },
    {
      label: 'Coiffeurs',
      total$: this.totalHairDressers$,
      config$: this.searchHairDressersConfig$,
      data$: this.hairDressers$,
      service: this.hairDresserService,
      route: '/hair-dressers'
    },
    {
      label: 'Cascadeurs',
      total$: this.totalStuntmen$,
      config$: this.searchStuntmenConfig$,
      data$: this.stuntmen$,
      service: this.stuntManService,
      route: '/stuntmen'
    },
    {
      label: 'Producteurs',
      total$: this.totalProducers$,
      config$: this.searchProducersConfig$,
      data$: this.producers$,
      service: this.producerService,
      route: '/producers'
    }
  ];

  constructor(
    private actorService: ActorService,
    private artDirectorService: ArtDirectorService,
    private casterService: CasterService,
    private costumierService: CostumierService,
    private countryService: CountryService,
    private decoratorService: DecoratorService,
    private directorService: DirectorService,
    private editorService: EditorService,
    private hairDresserService: HairDresserService,
    private makeupArtistService: MakeupArtistService,
    private musicianService: MusicianService,
    private photographerService: PhotographerService,
    private producerService: ProducerService,
    private screenwriterService: ScreenwriterService,
    private soundEditorService: SoundEditorService,
    private stuntManService: StuntmanService,
    private route: ActivatedRoute,
    private router: Router,
    private visualEffectsSupervisorService: VisualEffectSupervisorsService
  ) {
    this.selectedTab$.pipe(
      filter(tabIndex => this.configMap.has(tabIndex)), // Vérifie si l'index correspond à un onglet concerné
      tap(tabIndex => this.configMap.get(tabIndex)!.next(INITIAL_CONFIG)) // Réinitialise la config
    ).subscribe();
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTab$.next(event.index);
  }

  clearSearch(sub$: BehaviorSubject<SearchConfig>) {
    sub$.next(
      {
        ...sub$.value,
        page: 0,
        term: ''
      }
    );
  }

  onSearch(sub$: BehaviorSubject<SearchConfig>, event: Event) {
    sub$.next(
      {
        ...sub$.value,
        page: 0,
        term: (event.target as HTMLInputElement).value
      }
    );
  }

  onScroll(sub$: BehaviorSubject<SearchConfig>) {
    sub$.next(
      {
        ...sub$.value,
        page: sub$.value.page + 1
      }
    );
  }
}
