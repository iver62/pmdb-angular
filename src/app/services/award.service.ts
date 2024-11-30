import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Award } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private basePath = ' http://localhost:8080/api/awards'

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Award[]>(this.basePath);
  }
}
