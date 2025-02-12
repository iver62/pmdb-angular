import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, Genre, Movie, MovieActor, Person, TechnicalTeam } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private basePath = ' http://localhost:8080/api/movies'

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Movie[]>(this.basePath);
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
