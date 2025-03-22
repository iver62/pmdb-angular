import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { map } from 'rxjs';
import { BarChartComponent, LineChartComponent } from '../../components';
import { ActorService, MovieService } from '../../services';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    BarChartComponent,
    LineChartComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  moviesNumber$ = this.movieService.countMovies();
  actorsNumber$ = this.actorService.count();
  decadeRepartition$ = this.movieService.getRepartitionByDecade().pipe(
    map(dataset => this.formatBarChartDataset(dataset))
  );
  genreRepartition$ = this.movieService.getRepartitionByGenre().pipe(
    map(dataset => this.formatBarChartDataset(dataset))
  );
  countryRepartition$ = this.movieService.getRepartitionByCountry().pipe(
    map(dataset => this.formatBarChartDataset(dataset))
  );
  userRepartition$ = this.movieService.getRepartitionByUser().pipe(
    map(dataset => this.formatBarChartDataset(dataset))
  );
  creationDateRepartition$ = this.movieService.getRepartitionByCreationDate().pipe(
    map(dataset => this.formatBarChartDataset(dataset))
  );
  creationDateEvolution$ = this.movieService.getEvolutionCreationDate().pipe(
    map(dataset => this.formatBarChartDataset(dataset))
  );

  colors = ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384', '#9966FF', '#FF9F40', '#8E5EA2'];

  constructor(
    private actorService: ActorService,
    private movieService: MovieService
  ) { }

  private formatBarChartDataset(dataset: { label: string, total: number }[]) {
    return {
      labels: dataset.map(d => d.label),
      datasets: [
        {
          data: dataset.map(d => d.total),
          backgroundColor: this.colors
        }
      ]
    }
  }
}
