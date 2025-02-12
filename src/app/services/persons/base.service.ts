import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Country, Movie, Person } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient, @Inject(String) public basePath: string) { }

  get(id: number) {
    return this.http.get<Person>(`${this.basePath}/${id}`);
  }

  getAll() {
    return this.http.get<Person[]>(this.basePath);
  }

  getMovies(person: Person) {
    return this.http.get<Movie[]>(`${this.basePath}/${person.id}/movies`)
  }

  getCountries(person: Person) {
    return this.http.get<Country[]>(`${this.basePath}/${person.id}/countries`)
  }

  getPhotoUrl(photoFileName: string) {
    return `${this.basePath}/photos/${photoFileName}`;
  }

  save(person: Person) {
    return this.http.post<Person>(this.basePath, person);
  }

  update(imageFile: File, person: Person) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }
    formData.append('personDTO', new Blob([JSON.stringify(person)], { type: 'application/json' }));
    return this.http.put<Person>(`${this.basePath}/${person.id}`, formData);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.basePath}/${id}`);
  }
}
