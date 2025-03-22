import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EMPTY_STRING } from '../app.component';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(term = EMPTY_STRING, sort = 'username', direction = 'asc') {
    const params = new URLSearchParams();

    term && params.set('term', encodeURIComponent(term));
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? 'Ascending' : 'Descending');

    return this.http.get<User[]>(`${this.basePath}?${params.toString()}`);
  }
}
