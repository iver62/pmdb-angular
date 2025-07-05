import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SseClient } from 'ngx-sse-client';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { EMPTY_STRING } from '../app.component';
import { Direction, Language } from '../enums';
import { Award, Category, CeremonyAwards, Country, Criterias, Movie, MovieActor, MovieTechnician, Person, TechnicalTeam, User } from '../models';
import { DateUtils } from '../utils';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private basePath = `${environment.apiBaseUrl}/movies`

  constructor(
    private dateService: DateService,
    private fb: FormBuilder,
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
   * @param direction le sens du tri (Ascending ou Descending)
   * @returns une liste de films
   */
  getMovies(page = 0, size = 50, term = EMPTY_STRING, sort = 'title', direction = 'asc', criterias?: Criterias) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? Direction.ASCENDING : Direction.DESCENDING);
    term && params.set('term', term);
    criterias?.fromReleaseDate && params.set('from-release-date', this.dateService.format(criterias.fromReleaseDate, DateUtils.API_DATE_FORMAT));
    criterias?.toReleaseDate && params.set('to-release-date', this.dateService.format(criterias.toReleaseDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromCreationDate && params.set('from-creation-date', this.dateService.format(criterias?.fromCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toCreationDate && params.set('to-creation-date', this.dateService.format(criterias?.toCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.fromLastUpdate && params.set('from-last-update', this.dateService.format(criterias?.fromLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toLastUpdate && params.set('to-last-update', this.dateService.format(criterias?.toLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.countries?.forEach(country => params.append('country', country.id.toString()));
    criterias?.categories?.forEach(category => params.append('category', category.id.toString()));
    criterias?.users?.forEach(user => params.append('user', user.id));

    return this.http.get<Movie[]>(`${this.basePath}?${params.toString()}`, { observe: 'response' });
  }

  getPersonsByMovie(id: number, page = 0, size = 50, term: string, sort = 'name', direction = 'asc', criterias?: Criterias) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? Direction.ASCENDING : Direction.DESCENDING);
    term && params.set('term', term);
    criterias?.fromBirthDate && params.set('from-birth-date', this.dateService.format(criterias.fromBirthDate, DateUtils.API_DATE_FORMAT));
    criterias?.toBirthDate && params.set('to-birth-date', this.dateService.format(criterias.toBirthDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromDeathDate && params.set('from-death-date', this.dateService.format(criterias.fromDeathDate, DateUtils.API_DATE_FORMAT));
    criterias?.toDeathDate && params.set('to-death-date', this.dateService.format(criterias.toDeathDate, DateUtils.API_DATE_FORMAT));
    criterias?.fromCreationDate && params.set('from-creation-date', this.dateService.format(criterias?.fromCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toCreationDate && params.set('to-creation-date', this.dateService.format(criterias?.toCreationDate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.fromLastUpdate && params.set('from-last-update', this.dateService.format(criterias?.fromLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.toLastUpdate && params.set('to-last-update', this.dateService.format(criterias?.toLastUpdate, DateUtils.API_DATE_TIME_FORMAT));
    criterias?.countries?.forEach(country => params.append('country', country.id.toString()));
    criterias?.types?.forEach(type => params.append('type', type.name));

    return this.http.get<Person[]>(`${this.basePath}/${id}/persons?${params.toString()}`, { observe: 'response' })
  }

  getOne(id: number) {
    return this.http.get<Movie>(`${this.basePath}/${id}`);
  }

  getPosterUrl(posterFileName: string) {
    return this.http.get(`${this.basePath}/posters/${posterFileName}`, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)) // Convertit le blob en URL locale utilisable dans <img>
    );
  }

  getCountries = (term: string, page = 0, size = 50, sort = 'nomFrFr', lang = Language.FR, direction = 'asc', id: number) =>
    this.http.get<Country[]>(`${this.basePath}/countries?page=${page}&size=${size}&sort=${sort}&lang=${lang}&direction=${direction == 'asc' ? Direction.ASCENDING : Direction.DESCENDING}&term=${term}`,
      { observe: 'response' }
    );

  getActors(id: number) {
    return this.http.get<MovieActor[]>(`${this.basePath}/${id}/actors`);
  }

  getTechnicalTeam(id: number) {
    return this.http.get<TechnicalTeam>(`${this.basePath}/${id}/technical-team`);
  }

  getCeremoniesAwards(id: number) {
    return this.http.get<CeremonyAwards[]>(`${this.basePath}/${id}/ceremonies-awards`);
  }

  getCategories(id: number) {
    return this.http.get<Category[]>(`${this.basePath}/${id}/categories`);
  }

  getCountriesByMovie(id: number) {
    return this.http.get<Country[]>(`${this.basePath}/${id}/countries`);
  }

  saveMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }

    if (movie.releaseDate) {
      movie.releaseDate = this.dateService.format(movie.releaseDate, DateUtils.API_DATE_FORMAT);
    }

    formData.append('movieDTO', new Blob([JSON.stringify(movie)], { type: 'application/json' }));
    return this.http.post<Movie>(this.basePath, formData);
  }

  saveProducers(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/producers`, movieTechnicians);
  }

  saveDirectors(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/directors`, movieTechnicians);
  }

  saveAssistantDirectors(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/assistant-directors`, movieTechnicians);
  }

  saveScreenwriters(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/screenwriters`, movieTechnicians);
  }

  saveComposers(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/composers`, movieTechnicians);
  }

  saveMusicians(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/musicians`, movieTechnicians);
  }

  saveSetDesigners(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/set-designers`, movieTechnicians);
  }

  saveCostumeDesigners(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/costume-designers`, movieTechnicians);
  }

  savePhotographers(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/photographers`, movieTechnicians);
  }

  saveEditors(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/editors`, movieTechnicians);
  }

  saveCasters(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/casters`, movieTechnicians);
  }

  saveArtists(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/artists`, movieTechnicians);
  }

  saveSoundEditors(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/sound-editors`, movieTechnicians);
  }

  saveVfxSupervisors(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/vfx-supervisors`, movieTechnicians);
  }

  saveSfxSupervisors(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/sfx-supervisors`, movieTechnicians);
  }

  saveMakeupArtists(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/makeup-artists`, movieTechnicians);
  }

  saveHairDressers(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/hair-dressers`, movieTechnicians);
  }

  saveStuntmen(id: number, movieTechnicians: MovieTechnician[]) {
    return this.http.put<MovieTechnician[]>(`${this.basePath}/${id}/stuntmen`, movieTechnicians);
  }

  saveCast(id: number, movieActors: MovieActor[]) {
    return this.http.put<MovieActor[]>(`${this.basePath}/${id}/cast`, movieActors);
  }

  saveAwards(id: number, ceremonyAwards: CeremonyAwards) {
    return this.http.put<CeremonyAwards>(`${this.basePath}/${id}/ceremony-awards`, ceremonyAwards);
  }

  updateMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }

    if (movie.releaseDate) {
      movie.releaseDate = this.dateService.format(movie.releaseDate, DateUtils.API_DATE_FORMAT);
    }

    formData.append('movieDTO', new Blob([JSON.stringify(movie)], { type: 'application/json' }));
    return this.http.put<Movie>(`${this.basePath}/${movie.id}`, formData);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.basePath}/${id}`);
  }

  deleteCeremonyAwards(movieId: number, ceremonyAwardsId: number) {
    return this.http.delete(`${this.basePath}/${movieId}/ceremony-awards/${ceremonyAwardsId}`);
  }

  buildMovieFromForm(form: FormGroup, user: User): Movie {
    return {
      ...form.value,
      user: user
    }
  }

  buildActorsFormArray(cast: MovieActor[]) {
    return this.fb.array(
      cast?.map(movieActor =>
        this.fb.group(
          {
            id: [movieActor.person.id],
            name: [movieActor.person.name, Validators.required],
            role: [movieActor.role, Validators.required],
          }
        )
      )
    );
  }

  buildTechniciansFormArray(technicians: MovieTechnician[]) {
    return this.fb.array(
      technicians?.map(t =>
        this.fb.group(
          {
            id: [t.person.id],
            name: [t.person.name, Validators.required],
            role: [t.role],
          }
        )
      )
    );
  }

  buildAwardsFormArray(awards: Award[]) {
    return this.fb.array(
      awards
        ?.sort(this.compare)
        ?.map(award =>
          this.fb.group(
            {
              id: [award.id],
              name: [award?.name, Validators.required], // Nom de la récompense
              persons: [award?.persons.map(p => ({ ...p, display: () => p.name }))], // Les personnes liés à la récompense
              year: [award?.year] // Année de la récompense
            }
          )
        )
      ?? []
    );
  }

  private compare(a: Award, b: Award) {
    return a.name.localeCompare(b.name);
  }
}
