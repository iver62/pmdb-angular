import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { Award } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private basePath = `${API_URL}/awards`

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Award[]>(this.basePath);
  }
}
