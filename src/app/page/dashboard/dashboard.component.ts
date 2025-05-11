import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { BarChartComponent, LineChartComponent } from '../../components';
import { BarChartService, LineChartService, StatsService } from '../../services';

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

  moviesNumber$ = this.statsService.listenTo('movie-count').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((n1, n2) => n1 == n2),
    tap(result => console.log('Nombre de films', result))
  );

  actorsNumber$ = this.statsService.listenTo('actor-count').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((n1, n2) => n1 == n2),
    tap(result => console.log('Nombre d\'acteurs', result))
  );

  moviesByReleaseDateRepartition$ = this.statsService.listenTo('movies-by-release-date').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((r1, r2) => JSON.stringify(r1) === JSON.stringify(r2)),
    tap(result => console.log('Films par décennie', result)),
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );

  moviesByCountryRepartition$ = this.statsService.listenTo('movies-by-country').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((r1, r2) => JSON.stringify(r1) === JSON.stringify(r2)),
    tap(result => console.log('Films par pays', result)),
    map(dataset => this.barChartService.formatBarChartCountryDataset(dataset, 'fr'))
  );

  moviesByCategoryRepartition$ = this.statsService.listenTo('movies-by-category').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((r1, r2) => JSON.stringify(r1) === JSON.stringify(r2)),
    tap(result => console.log('Films par genre', result)),
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );

  moviesByUserRepartition$ = this.statsService.listenTo('movies-by-user').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((r1, r2) => JSON.stringify(r1) === JSON.stringify(r2)),
    tap(result => console.log('Films par utilisateur', result)),
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );

  creationDateRepartition$ = this.statsService.listenTo('movies-number-by-creation-date').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((r1, r2) => JSON.stringify(r1) === JSON.stringify(r2)),
    tap(result => console.log('Nombre de films par date de création', result)),
    map(dataset => this.barChartService.formatBarChartDataset(dataset))
  );

  moviesNumberEvolution$ = this.statsService.listenTo('movies-number-evolution').pipe(
    takeUntilDestroyed(),
    distinctUntilChanged((r1, r2) => JSON.stringify(r1) === JSON.stringify(r2)),
    tap(result => console.log('Evolution du nombre de films', result)),
    map(dataset => this.lineChartService.buildLineChartDataset(dataset))
  );

  constructor(
    private barChartService: BarChartService,
    private lineChartService: LineChartService,
    private statsService: StatsService
  ) { }
}
