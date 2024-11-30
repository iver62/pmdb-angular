import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private basePath = ' http://localhost:8080/api/countries'

  constructor(private http: HttpClient) { }

  getAll() {
    console.log('SERVICE');

    return this.http.get<Country[]>(this.basePath);
  }
}
