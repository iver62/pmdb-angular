import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateService } from '../date.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ArtDirectorService extends BaseService {

  constructor(http: HttpClient, dateService: DateService) {
    super(http, dateService, 'http://localhost:8080/api/art-directors');
  }
}
