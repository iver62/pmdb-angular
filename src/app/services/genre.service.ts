import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre, Movie } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private basePath = ' http://localhost:8080/api/genres'

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Genre[]>(`${this.basePath}`);
  }

  getAllMovies(id: number, title: string, sort = 'title', direction = 'Ascending') {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies/all?sort=${sort}&direction=${direction}&title=${title}`, {
      observe: 'response'
    });
  }

  getMovies(id: number, page = 0, size = 20, title: string, sort = 'title', direction = 'Ascending') {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies?page=${page}&size=${size}&sort=${sort}&direction=${direction}&title=${title}`, {
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
