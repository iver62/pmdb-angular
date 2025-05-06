import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { BarChartComponent, LineChartComponent } from '../../components';
import { ActorService, BarChartService, MovieService } from '../../services';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    BarChartComponent,
    DecimalPipe,
    LineChartComponent,
    MatCardModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  moviesNumber$ = this.movieService.getMovieCountStream().pipe(
    takeUntilDestroyed(),
    tap(event => {
      if (event.type === 'error') {
        const errorEvent = event as ErrorEvent;
        console.error(errorEvent.error, errorEvent.message);
      }
    }),
    map(event => {
      const messageEvent = event as MessageEvent;
      return messageEvent.data;
    })
  );

  actorsNumber$ = this.actorService.getActorCountStream().pipe(
    takeUntilDestroyed(),
    tap(event => {
      if (event.type === 'error') {
        const errorEvent = event as ErrorEvent;
        console.error(errorEvent.error, errorEvent.message);
      }
    }),
    map(event => {
      const messageEvent = event as MessageEvent;
      return messageEvent.data;
    })
  );

  decadeRepartition$ = this.movieService.getRepartitionByDecade().pipe(
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );
  genreRepartition$ = this.movieService.getRepartitionByGenre().pipe(
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );
  countryRepartition$ = combineLatest([
    this.movieService.getRepartitionByCountry(),
    this.translate.onLangChange.pipe(
      map(event => event.lang),
      startWith(localStorage.getItem('lang') || this.translate.defaultLang)
    )
  ]).pipe(
    map(([dataset, lang]) => this.barChartService.formatBarChartCountryDataset(dataset, lang))
  );
  userRepartition$ = this.movieService.getRepartitionByUser().pipe(
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );
  creationDateRepartition$ = this.movieService.getRepartitionByCreationDate().pipe(
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );
  creationDateEvolution$ = this.movieService.getEvolutionCreationDate().pipe(
    map(dataset => (
      {
        labels: dataset.map(d => d.label),
        datasets: [
          {
            data: dataset.map(d => d.total),
            borderColor: '#36A2EB',
            pointBorderColor: '#36A2EB',
          }
        ]
      }
    ))
  );

  constructor(
    private actorService: ActorService,
    private barChartService: BarChartService,
    private movieService: MovieService,
    private translate: TranslateService
  ) { }
}
