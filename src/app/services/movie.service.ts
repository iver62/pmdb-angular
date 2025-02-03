import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Award, Country, Genre, Movie, Person, TechnicalSummary } from '../models';

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
    return `${this.basePath}/poster/${posterFileName}`;
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

  saveTechnicalSummay(id: number, technicalSummary: TechnicalSummary) {
    return this.http.put<TechnicalSummary>(`${this.basePath}/${id}/technical-summary`, technicalSummary);
  }

  updateMovie(imageFile: File, movie: Movie) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }
    formData.append('movieDTO', new Blob([JSON.stringify(movie)], { type: 'application/json' }));
    return this.http.put<Movie>(`${this.basePath}/${movie.id}`, formData);
  }

  // saveProducers(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/producers`, persons);
  // }

  // saveDirectors(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/directors`, persons);
  // }

  // saveScreewriters(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/screenwriters`, persons);
  // }

  // saveMusicians(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/musicians`, persons);
  // }

  // saveDecorators(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/decorators`, persons);
  // }

  // saveCostumiers(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/costumiers`, persons);
  // }

  // savePhotographers(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/photographers`, persons);
  // }

  // saveEditors(id: number, persons: Person[]) {
  //   return this.http.put<Person[]>(`${this.basePath}/${id}/editors`, persons);
  // }

  // saveGenres(id: number, genres: Genre[]) {
  //   return this.http.put<Genre[]>(`${this.basePath}/${id}/genres`, genres);
  // }

  // saveCountries(id: number, countries: Country[]) {
  //   return this.http.put<Country[]>(`${this.basePath}/${id}/countries`, countries);
  // }

  // saveAwards(id: number, awards: Award[]) {
  //   return this.http.put<Award[]>(`${this.basePath}/${id}/awards`, awards);
  // }

  removeProducer(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/producers/${personId}`, null);
  }

  removeDirector(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/directors/${personId}`, null);
  }

  removeScreenwriter(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/screenwriters/${personId}`, null);
  }

  removeMusician(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/musicians/${personId}`, null);
  }

  removeDecorator(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/decorators/${personId}`, null);
  }

  removeCostumier(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/costumiers/${personId}`, null);
  }

  removePhotographer(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/photographers/${personId}`, null);
  }

  removeEditor(movieId: number, personId: number) {
    return this.http.put<Person[]>(`${this.basePath}/${movieId}/editors/${personId}`, null);
  }

  removeGenre(movieId: number, genreId: number) {
    return this.http.put<Genre[]>(`${this.basePath}/${movieId}/genres/${genreId}`, null);
  }

  removeCountry(movieId: number, countryId: number) {
    return this.http.put<Country[]>(`${this.basePath}/${movieId}/countries/${countryId}`, null);
  }

  removeAward(movieId: number, awardId: number) {
    return this.http.put<Award[]>(`${this.basePath}/${movieId}/awards/${awardId}`, null);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.basePath}/${id}`);
  }
}
