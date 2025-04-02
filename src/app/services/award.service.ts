import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Award } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private basePath = `${environment.apiBaseUrl}/awards`

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Award[]>(this.basePath);
  }

  getCeremonies(page = 0, size = 50, direction = 'asc', term: string) {
    return this.http.get<string[]>(`${this.basePath}/ceremonies?page=${page}&size=${size}&direction=${direction == 'asc' ? 'Ascending' : 'Descending'}&term=${term}`, {
      observe: 'response'
    });
  }
}
