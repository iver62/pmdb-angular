import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { catchError, of, switchMap } from 'rxjs';
import { MoviesListComponent, PersonsListComponent } from '../../components';
import { ActorService, ArtDirectorService, CasterService, CostumierService, CountryService, DecoratorService, DirectorService, EditorService, HairDresserService, MakeupArtistService, MusicianService, PhotographerService, ProducerService, ScreenwriterService, SoundEditorService, StuntmanService, VisualEffectSupervisorsService } from '../../services';

@Component({
  selector: 'app-country-details',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MoviesListComponent,
    NgPipesModule,
    RouterLink,
    PersonsListComponent
  ],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.css'
})
export class CountryDetailsComponent {

  country$ = this.route.paramMap.pipe(
    switchMap(params => this.countryService.getFull(+params.get('id'))),
    catchError(error => {
      console.error('Erreur lors de la récupération du pays:', error);
      return of(null); // Retourne un observable avec null en cas d'erreur
    })
  );

  constructor(
    public actorService: ActorService,
    public artDirectorService: ArtDirectorService,
    public casterService: CasterService,
    public costumierService: CostumierService,
    private countryService: CountryService,
    public decoratorService: DecoratorService,
    public directorService: DirectorService,
    public editorService: EditorService,
    public hairDresserService: HairDresserService,
    public makeupArtistService: MakeupArtistService,
    public musicianService: MusicianService,
    public photographerService: PhotographerService,
    public producerService: ProducerService,
    public screenwriterService: ScreenwriterService,
    public soundEditorService: SoundEditorService,
    public stuntManService: StuntmanService,
    private route: ActivatedRoute,
    public visualEffectsSupervisorService: VisualEffectSupervisorsService
  ) { }

}
