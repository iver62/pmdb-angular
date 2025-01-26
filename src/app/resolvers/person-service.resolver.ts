import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { throwError } from 'rxjs';
import { ArtDirectorService, BaseService, CasterService, CostumierService, DecoratorService, DirectorService, EditorService, HairDresserService, MakeupArtistService, MusicianService, PhotographerService, ProducerService, ScreenwriterService, SoundEditorService, VisualEffectSupervisorsService } from '../services';

export const personServiceResolver: ResolveFn<BaseService> = (route, state) => {
  // Mapping des types de personnes vers leurs services
  const serviceMap: { [key: string]: BaseService } = {
    producers: inject(ProducerService),
    directors: inject(DirectorService),
    screenwriters: inject(ScreenwriterService),
    musicians: inject(MusicianService),
    photographers: inject(PhotographerService),
    costumiers: inject(CostumierService),
    decorators: inject(DecoratorService),
    editors: inject(EditorService),
    casters: inject(CasterService),
    'art-directors': inject(ArtDirectorService),
    'sound-editors': inject(SoundEditorService),
    'visual-effects-supervisors': inject(VisualEffectSupervisorsService),
    'makeup-artists': inject(MakeupArtistService),
    'hair-dressers': inject(HairDresserService)
  };

  // Récupérer le type depuis l'URL (premier élément du chemin)
  const personType = route.url.at(0)?.path;

  // Vérifier si un service existe pour ce type
  const service = serviceMap[personType];

  if (!service) {
    console.log('Route inconnue:', personType);
    return throwError(() => new Error(`Unknown route: ${personType}`)); // Retourner une erreur observable pour une route inconnue
  }

  return service;
};
