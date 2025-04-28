import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { combineLatest, map, startWith } from 'rxjs';
import { BarChartComponent, LineChartComponent } from '../../components';
import { ActorService, MovieService } from '../../services';
import { BarChartService } from '../../services/bar-chart.service';

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

  moviesNumber$ = this.movieService.countMovies();
  actorsNumber$ = this.actorService.count();
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
