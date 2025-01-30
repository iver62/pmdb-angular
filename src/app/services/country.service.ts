import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, Movie, Person } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private basePath = ' http://localhost:8080/api/countries'

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<Country>(`${this.basePath}/${id}`);
  }

  getFull(id: number) {
    return this.http.get<Country>(`${this.basePath}/${id}/full`);
  }

  getAll() {
    return this.http.get<Country[]>(this.basePath);
  }

  getMovies(id: number) {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies`);
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
}
