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
    return this.http.get<Genre[]>(this.basePath);
  }

  getMovies(id: number) {
    return this.http.get<Movie[]>(`${this.basePath}/${id}/movies`);
  }

  save(genre: Genre) {
    return this.http.post<Genre>(this.basePath, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.basePath}/${id}`);
  }
}
