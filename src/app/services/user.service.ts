import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EMPTY_STRING } from '../app.component';
import { Direction } from '../enums';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) { }

  get(page = 0, size = 50, term = EMPTY_STRING, sort = 'username', direction = 'asc') {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('size', size.toString());
    term && params.set('term', encodeURIComponent(term));
    params.set('sort', sort);
    params.set('direction', direction === 'asc' ? Direction.ASCENDING : Direction.DESCENDING);

    return this.http.get<User[]>(`${this.basePath}?${params.toString()}`, { observe: 'response' });
  }
}
