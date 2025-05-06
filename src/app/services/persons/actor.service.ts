import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { environment } from '../../../environments/environment';
import { DateService } from '../date.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ActorService extends BaseService {

  override basePath = `${environment.apiBaseUrl}/actors`;

  constructor(
    dateService: DateService,
    http: HttpClient,
    private sseClient: SseClient
  ) {
    super(http, dateService, `${environment.apiBaseUrl}/actors`);
  }

  getActorCountStream() {
    return this.sseClient.stream(`${this.basePath}/count-stream`, { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, {}, 'GET');
  }

}
