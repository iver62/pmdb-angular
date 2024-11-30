import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private basePath = ' http://localhost:8080/api/persons'

  constructor(private http: HttpClient) { }

  getProducers() {
    return this.http.get<Person[]>(`${this.basePath}/producers`);
  }

  getDirectors() {
    return this.http.get<Person[]>(`${this.basePath}/directors`);
  }

  getScreenwriters() {
    return this.http.get<Person[]>(`${this.basePath}/screenwriters`);
  }

  getMusicians() {
    return this.http.get<Person[]>(`${this.basePath}/musicians`);
  }

  getDecorators() {
    return this.http.get<Person[]>(`${this.basePath}/decorators`);
  }

  getCostumiers() {
    return this.http.get<Person[]>(`${this.basePath}/costumiers`);
  }

  getPhotographers() {
    return this.http.get<Person[]>(`${this.basePath}/photographers`);
  }

  getEditors() {
    return this.http.get<Person[]>(`${this.basePath}/editors`);
  }
}
