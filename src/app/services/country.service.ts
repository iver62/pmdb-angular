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

  getMoviesByCountry(id: number, page = 0, size = 20, title: string, sort = 'title', direction = 'Ascending') {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies?page=${page}&size=${size}&sort=${sort}&direction=${direction}&title=${title}`, {
      observe: 'response'
    });
  }

  getActorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/actors?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getDirectorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/directors?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getScreenwritersByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/screenwriters?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getMusiciansByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/musicians?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getDecoratorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/decorators?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getCostumiersByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/costumiers?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getPhotographersByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/photographers?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getEditorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/editors?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getCastersByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/casters?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getArtDirectorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/art-directors?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getSoundEditorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/sound-editors?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getProducersByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/producers?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getVisualEffectsSupervisorsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/visual-effects-supervisors?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getMakeupArtistsByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/makeup-artists?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getHairDressersByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/hair-dressers?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }

  getStuntmenByCountry(id: number, page = 0, size = 20, name: string, sort = 'name', direction = 'Ascending') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/stuntmen?page=${page}&size=${size}&sort=${sort}&direction=${direction}&name=${name}`, {
      observe: 'response'
    });
  }
}
