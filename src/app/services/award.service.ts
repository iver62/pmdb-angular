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
}
