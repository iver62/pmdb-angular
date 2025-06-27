import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Direction } from '../enums';
import { Ceremony } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CeremonyService {

  private basePath = `${environment.apiBaseUrl}/ceremonies`

  constructor(private http: HttpClient) { }

  getCeremonies(page = 0, size = 50, term: string, direction = 'asc') {
    return this.http.get<Ceremony[]>(`${this.basePath}?page=${page}&size=${size}&direction=${direction == 'asc' ? Direction.ASCENDING : Direction.DESCENDING}&term=${term}`, {
      observe: 'response'
    });
  }
}
