import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Person } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient, @Inject(String) private basePath: string) { }

  getAll() {
    return this.http.get<Person[]>(this.basePath);
  }

  save(person: Person) {
    return this.http.post<Person>(this.basePath, person);
  }
}
