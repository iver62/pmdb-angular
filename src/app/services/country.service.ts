import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Direction, Language } from '../enums';
import { Country } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private basePath = `${environment.apiBaseUrl}/countries`

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<Country>(`${this.basePath}/${id}`);
  }

  getFull(id: number) {
    return this.http.get<Country>(`${this.basePath}/${id}/full`);
  }

  getCountries(page = 0, size = 50, term: string, sort = 'nomFrFr', lang = Language.FR, direction = 'asc') {
    return this.http.get<Country[]>(`${this.basePath}?page=${page}&size=${size}&sort=${sort}&lang=${lang}&direction=${direction == 'asc' ? Direction.ASCENDING : Direction.DESCENDING}&term=${term}`, {
      observe: 'response'
    });
  }
}
