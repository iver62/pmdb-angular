import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, Filters, Genre, Movie, MovieActor, Person, TechnicalTeam } from '../models';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private basePath = ' http://localhost:8080/api/movies'

  constructor(
    private dateService: DateService,
    private http: HttpClient
  ) { }

  getAll(title: string, sort = 'title', direction = 'Ascending') {
    return this.http.get<Movie[]>(`${this.basePath}/all?sort=${sort}&direction=${direction}&title=${title}`, {
      observe: 'response'
    });
  }

  /**
   * Récupère une liste paginée de n films triés et filtrés. 
   * @param page la page à récupérer
   * @param size le nombre de films
   * @param term le filtre
   * @param sort la propriété à filtrer
   * @param direction le sens du tri ('Ascending' ou 'Descending')
   * @returns une liste de films
   */
  getMovies(page = 0, size = 50, term = '', sort = 'title', direction = 'Ascending', filters?: Filters) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? 'Ascending' : 'Descending');
    term && params.set('term', encodeURIComponent(term));
    filters?.startReleaseDate && params.set('start-release-date', this.dateService.format(filters.startReleaseDate, 'YYYY-MM-DD'));
    filters?.endReleaseDate && params.set('end-release-date', this.dateService.format(filters.endReleaseDate, 'YYYY-MM-DD'));
    filters?.startCreationDate && params.set('start-creation-date', this.dateService.format(filters?.startCreationDate, 'YYYY-MM-DDTHH:mm:ss'));
    filters?.endCreationDate && params.set('end-creation-date', this.dateService.format(filters?.endCreationDate, 'YYYY-MM-DDTHH:mm:ss'));
    filters?.startLastUpdate && params.set('start-last-update', this.dateService.format(filters?.startLastUpdate, 'YYYY-MM-DDTHH:mm:ss'));
    filters?.endLastUpdate && params.set('end-last-update', this.dateService.format(filters?.endLastUpdate, 'YYYY-MM-DDTHH:mm:ss'));
    filters?.countries?.forEach(country => params.append('country', country.id.toString()));
    filters?.genres?.forEach(genre => params.append('genre', genre.id.toString()));

    return this.http.get<Movie[]>(`${this.basePath}?${params.toString()}`, { observe: 'response' });
  }

  getOne(id: number) {
    return this.http.get<Movie>(`${this.basePath}/${id}`);
  }

  getPosterUrl(posterFileName: string): string {
    return `${this.basePath}/posters/${posterFileName}`;
  }

  getActors(id: number) {
    return this.http.get<MovieActor[]>(`${this.basePath}/${id}/actors`);
  }

  getTechnicalTeam(id: number) {
    return this.http.get<TechnicalTeam>(`${this.basePath}/${id}/technical-team`);
  }

  getProducers(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/producers`);
  }

  getDirectors(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/directors`);
  }

  getScreenwriters(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/screenwriters`);
  }

  getMusicians(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/musicians`);
  }

  getPhotographers(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/photographers`);
  }

  getCostumiers(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/costumiers`);
  }

  getDecorators(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/decorators`);
  }

  getEditors(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/editors`);
  }

  getCasters(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/casters`);
  }

  getArtDirectors(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/art-directors`);
  }

  getSoundEditors(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/sound-editors`);
  }

  getVisualEffectsSupervisors(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/visual-effects-supervisors`);
  }

  getMakeupArtists(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/makeup-artists`);
  }

  getHairDressers(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/hair-dressers`);
  }

  getStuntmen(id: number) {
    return this.http.get<Person[]>(`${this.basePath}/${id}/stuntmen`);
  }

  getGenres(id: number) {
    return this.http.get<Genre[]>(`${this.basePath}/${id}/genres`);
  }

  getCountries(id: number) {
    return this.http.get<Country[]>(`${this.basePath}/${id}/countries`);
  }

  saveMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }
    formData.append('movieDTO', new Blob([JSON.stringify(movie)], { type: 'application/json' }));
    return this.http.post<Movie>(this.basePath, formData);
  }

  saveTechnicalTeam(id: number, technicalTeam: TechnicalTeam) {
    return this.http.put<TechnicalTeam>(`${this.basePath}/${id}/technical-team`, technicalTeam);
  }

  saveCasting(id: number, movieActors: MovieActor[]) {
    return this.http.put<MovieActor[]>(`${this.basePath}/${id}/casting`, movieActors);
  }

  updateMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }
    formData.append('movieDTO', new Blob([JSON.stringify(movie)], { type: 'application/json' }));
    return this.http.put<Movie>(`${this.basePath}/${movie.id}`, formData);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.basePath}/${id}`);
  }
}
