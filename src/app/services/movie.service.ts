import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { EMPTY_STRING } from '../app.component';
import { Language } from '../enums';
import { Award, Country, Criterias, Genre, Movie, MovieActor, Person, TechnicalTeam } from '../models';
import { DateUtils } from '../utils';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private basePath = `${environment.apiBaseUrl}/movies`

  constructor(
    private dateService: DateService,
    private http: HttpClient,
    private sseClient: SseClient
  ) { }

  getMovieCountStream() {
    return this.sseClient.stream(`${this.basePath}/count-stream`, { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, {}, 'GET');
  }

  countMovies() {
    return this.http.get<number>(`${this.basePath}/count`);
  }

  getAll(title: string, sort = 'title', direction = 'asc') {
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
  getMovies(page = 0, size = 50, term = EMPTY_STRING, sort = 'title', direction = 'asc', criterias?: Criterias) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? 'Ascending' : 'Descending');
    term && params.set('term', encodeURIComponent(term));
    criterias?.fromReleaseDate && params.set('from-release-date', this.dateService.format(criterias.fromReleaseDate, DateUtils.API_DATE_FORMAT));
    criterias?.toReleaseDate && params.set('to-release-date', this.dateService.format(criterias.toReleaseDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromCreationDate && params.set('from-creation-date', this.dateService.format(criterias?.fromCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toCreationDate && params.set('to-creation-date', this.dateService.format(criterias?.toCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.fromLastUpdate && params.set('from-last-update', this.dateService.format(criterias?.fromLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toLastUpdate && params.set('to-last-update', this.dateService.format(criterias?.toLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.countries?.forEach(country => params.append('country', country.id.toString()));
    criterias?.genres?.forEach(genre => params.append('genre', genre.id.toString()));
    criterias?.users?.forEach(user => params.append('user', user.id));

    return this.http.get<Movie[]>(`${this.basePath}?${params.toString()}`, { observe: 'response' });
  }

  getOne(id: number) {
    return this.http.get<Movie>(`${this.basePath}/${id}`);
  }

  getPosterUrl(posterFileName: string) {
    return this.http.get(`${this.basePath}/posters/${posterFileName}`, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)) // Convertit le blob en URL locale utilisable dans <img>
    );
  }

  getCountries = (term: string, page = 0, size = 50, sort = 'nomFrFr', lang = Language.FR, direction = 'asc') =>
    this.http.get<Country[]>(`${this.basePath}/countries?page=${page}&size=${size}&sort=${sort}&lang=${lang}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`,
      { observe: 'response' }
    );


  getActors(id: number) {
    return this.http.get<MovieActor[]>(`${this.basePath}/${id}/actors`);
  }

  getTechnicalTeam(id: number) {
    return this.http.get<TechnicalTeam>(`${this.basePath}/${id}/technical-team`);
  }

  getAwards(id: number) {
    return this.http.get<Award[]>(`${this.basePath}/${id}/awards`);
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

  getCountriesByMovie(id: number) {
    return this.http.get<Country[]>(`${this.basePath}/${id}/countries`);
  }

  saveMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }
    formData.append('movieDTO', new Blob([JSON.stringify({ ...movie, releaseDate: this.dateService.format(movie.releaseDate, 'YYYY-MM-DD') })], { type: 'application/json' }));
    return this.http.post<Movie>(this.basePath, formData);
  }

  saveTechnicalTeam(id: number, technicalTeam: TechnicalTeam) {
    return this.http.put<TechnicalTeam>(`${this.basePath}/${id}/technical-team`, technicalTeam);
  }

  saveCasting(id: number, movieActors: MovieActor[]) {
    return this.http.put<MovieActor[]>(`${this.basePath}/${id}/casting`, movieActors);
  }

  saveAwards(id: number, awards: Award[]) {
    return this.http.put<Award[]>(`${this.basePath}/${id}/awards`, awards);
  }

  updateMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }
    formData.append('movieDTO', new Blob([JSON.stringify({ ...movie, releaseDate: this.dateService.format(movie.releaseDate, 'YYYY-MM-DD') })], { type: 'application/json' }));
    return this.http.put<Movie>(`${this.basePath}/${movie.id}`, formData);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.basePath}/${id}`);
  }
}
