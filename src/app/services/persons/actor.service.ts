import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DateService } from '../date.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ActorService extends BaseService {

  constructor(http: HttpClient, dateService: DateService) {
    super(http, dateService, `${environment.apiBaseUrl}/actors`);
  }

}
