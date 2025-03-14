import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import { DateService } from '../date.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ScreenwriterService extends BaseService {

  constructor(http: HttpClient, dateService: DateService) {
    super(http, dateService, `${API_URL}/screenwriters`);
  }
}
