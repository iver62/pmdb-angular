import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, concatMap, map, of, throwError } from 'rxjs';
import { Person } from '../models';
import { ArtDirectorService, BaseService, CasterService, CostumierService, DecoratorService, DirectorService, EditorService, HairDresserService, MakeupArtistService, MusicianService, PhotographerService, ProducerService, ScreenwriterService, SoundEditorService, VisualEffectSupervisorsService } from '../services';

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

export const personTypeResolver: ResolveFn<Person> = (route, state) => {
  // Récupérer le type depuis l'URL (premier élément du chemin)
  const personType = route.url.at(0)?.path;

  // Vérifier si un service existe pour ce type
  const service = serviceMap[personType];

  if (!service) {
    console.log('Route inconnue:', personType);
    return throwError(() => new Error(`Unknown route: ${personType}`)); // Retourner une erreur observable pour une route inconnue
  }

  // Récupération de l'ID depuis les paramètres de la route
  const id = Number(route.paramMap.get('id'));

  // Vérification si l'ID est valide
  if (isNaN(id)) {
    console.log('ID invalide');
    return throwError(() => new Error('Invalid ID'));
  }

  // Appelle la méthode `get` et retourne son résultat (Observable)
  return service.get(id).pipe(
    concatMap(p => service.getMovies(p).pipe(
      map(movies => ({ ...p, movies: movies }))
    )),
    catchError(error => {
      console.error('Erreur lors de la récupération des données:', error);
      return of(null); // Retourne un observable avec null en cas d'erreur
    })
  );
};
