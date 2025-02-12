import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieActor, Person } from '../../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ActorService extends BaseService {

  override readonly basePath = 'http://localhost:8080/api/actors';

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/actors');
  }

  override getMovies(person: Person) {
    return this.http.get<MovieActor[]>(`${this.basePath}/${person.id}/movie-actors`)
      .pipe(
        map(result => result.map(movieActor => movieActor.movie))
      )
  }
}
