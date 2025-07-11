import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, distinctUntilChanged, map, tap } from 'rxjs';
import { BarChartComponent, LineChartComponent } from '../../components';
import { BarChartService, ConfigService, LineChartService, StatsService } from '../../services';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    BarChartComponent,
    DecimalPipe,
    LineChartComponent,
    MatCardModule,
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

  moviesByReleaseDateRepartition$ = combineLatest([
    this.statsService.listenTo('movies-by-release-date'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Films par décennie', result)),
    map(([dataset, darkMode]) => this.barChartService.formatBarChartDataset(dataset, darkMode))
  );

  moviesByCountryRepartition$ = combineLatest([
    this.statsService.listenTo('movies-by-country'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Films par pays', result)),
    map(([dataset, darkMode]) => this.barChartService.formatBarChartCountryDataset(dataset, 'fr', darkMode))
  );

  moviesByCategoryRepartition$ = combineLatest([
    this.statsService.listenTo('movies-by-category'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Films par catégorie', result)),
    map(([dataset, darkMode]) => this.barChartService.formatBarChartDataset(dataset, darkMode))
  );

  moviesByUserRepartition$ = combineLatest([
    this.statsService.listenTo('movies-by-user'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Films par utilisateur', result)),
    map(([dataset, darkMode]) => this.barChartService.formatBarChartDataset(dataset, darkMode))
  );

  creationDateRepartition$ = combineLatest([
    this.statsService.listenTo('movies-number-by-creation-date'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Nombre de films par date de création', result)),
    map(([dataset, darkMode]) => this.barChartService.formatBarChartDataset(dataset, darkMode))
  );

  moviesNumberEvolution$ = combineLatest([
    this.statsService.listenTo('movies-number-evolution'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Evolution du nombre de films', result)),
    map(([dataset, darkMode]) => this.lineChartService.buildLineChartDataset(dataset, darkMode))
  );

  actorsNumberEvolution$ = combineLatest([
    this.statsService.listenTo('actors-number-evolution'),
    this.configService.isDarkMode$
  ]).pipe(
    takeUntilDestroyed(),
    distinctUntilChanged(([r1, d1], [r2, d2]) => JSON.stringify(r1) === JSON.stringify(r2) && d1 === d2),
    tap(([result]) => console.log('Evolution du nombre d\'acteurs', result)),
    map(([dataset, darkMode]) => this.lineChartService.buildLineChartDataset(dataset, darkMode))
  );

  constructor(
    private barChartService: BarChartService,
    private configService: ConfigService,
    private lineChartService: LineChartService,
    private statsService: StatsService
  ) { }
}
