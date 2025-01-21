import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ArtDirectorService extends BaseService {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/art-directors');
  }
}
