import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Award } from '../models';
import { Direction } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private basePath = `${environment.apiBaseUrl}/awards`

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Award[]>(this.basePath);
  }

  getCeremonies(page = 0, size = 50, term: string, direction = 'asc') {
    return this.http.get<string[]>(`${this.basePath}/ceremonies?page=${page}&size=${size}&direction=${direction == 'asc' ? Direction.ASCENDING : Direction.DESCENDING}&term=${term}`, {
      observe: 'response'
    });
  }
}
