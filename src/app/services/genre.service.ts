import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY_STRING } from '../app.component';
import { API_URL } from '../app.config';
import { Genre, Movie } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private basePath = `${API_URL}/genres`

  constructor(private http: HttpClient) { }

  getAll(term = EMPTY_STRING, sort = 'name', direction = 'asc') {
    return this.http.get<Genre[]>(`${this.basePath}?sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`);
  }

  getAllMovies(id: number, term: string, sort = 'title', direction = 'asc') {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies/all?sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  getMovies(id: number, page = 0, size = 50, term: string, sort = 'title', direction = 'asc') {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies?page=${page}&size=${size}&sort=${sort}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }

  save(genre: Genre) {
    return this.http.post<Genre>(this.basePath, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.basePath}/${id}`);
  }
}
