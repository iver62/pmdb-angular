import { Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { filter, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private basePath = `${environment.apiBaseUrl}/stats`

  constructor(private sseClient: SseClient) { }

  getStatisticsStream() {
    return this.sseClient.stream(`${this.basePath}`, { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, {}, 'GET');
  }

  listenTo(type: string) {
    return this.getStatisticsStream().pipe(
      tap(event => {
        if (event.type === 'error') {
          const errorEvent = event as ErrorEvent;
          console.error(errorEvent.error, errorEvent.message);
        }
      }),
      filter(event => event.type === type),
      map(event => JSON.parse((event as MessageEvent).data))
    );
  }
}
