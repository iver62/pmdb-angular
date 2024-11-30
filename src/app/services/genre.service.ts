import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private basePath = ' http://localhost:8080/api/genres'

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Genre[]>(this.basePath);
  }
}
