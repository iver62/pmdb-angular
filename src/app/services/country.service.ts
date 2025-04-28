import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Country, Movie, Person } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private basePath = `${environment.apiBaseUrl}/countries`

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<Country>(`${this.basePath}/${id}`);
  }

  getFull(id: number) {
    return this.http.get<Country>(`${this.basePath}/${id}/full`);
  }

  getAll(term?: string, sort = 'nomFrFr', direction = 'asc') {
    return this.http.get<Country[]>(`${this.basePath}/all?sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`);
  }

  getCountries(page = 0, size = 50, term: string, sort = 'nomFrFr', lang = 'fr', direction = 'asc') {
    return this.http.get<Country[]>(`${this.basePath}?page=${page}&size=${size}&sort=${sort}&lang=${lang}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getMoviesByCountry(id: number, page = 0, size = 50, term: string, sort = 'title', direction = 'asc') {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getActorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/actors?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getDirectorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/directors?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getScreenwritersByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/screenwriters?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getMusiciansByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/musicians?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getDecoratorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/decorators?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getCostumiersByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/costumiers?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getPhotographersByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/photographers?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getEditorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/editors?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getCastersByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/casters?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getArtDirectorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/art-directors?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getSoundEditorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/sound-editors?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getProducersByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/producers?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getVisualEffectsSupervisorsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/visual-effects-supervisors?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getMakeupArtistsByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/makeup-artists?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getHairDressersByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/hair-dressers?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getStuntmenByCountry(id: number, page = 0, size = 20, term: string, sort = 'name', direction = 'asc') {
    return this.http.get<Person[]>(`${this.basePath}/${id}/stuntmen?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }
}
