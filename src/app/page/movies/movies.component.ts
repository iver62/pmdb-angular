import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgPipesModule } from 'ngx-pipes';
import { map } from 'rxjs';
import { MoviesListComponent } from '../../components';
import { Movie } from '../../models';
import { MovieService } from '../../services';

@Component({
  selector: 'app-movies',
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MoviesListComponent,
    NgPipesModule
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {

  movies$ = this.movieService.getAll().pipe(
    map(result =>
      result.map(m => (
        {
          id: m.id,
          title: m.title,
          releaseDate: m.releaseDate
        }
      ))
    )
  );
  view: 'table' | 'cards' = 'cards';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  displayedColumns = ['title', 'originalTitle', 'releaseDate', 'runningTime', 'budget', 'boxOffice'];
  data: Movie[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private movieService: MovieService) { }

  // ngAfterViewInit() {
  //   // If the user changes the sort order, reset back to the first page.
  //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         return this.movieService!.getAll().pipe(catchError(() => of(null)));
  //       }),
  //       map(data => {
  //         // Flip flag to show that loading has finished.
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = data === null;

  //         if (data === null) {
  //           return [];
  //         }

  //         // Only refresh the result length if there is new data. In case of rate
  //         // limit errors, we do not want to reset the paginator to zero, as that
  //         // would prevent users from re-triggering requests.
  //         // this.resultsLength = data.total_count;
  //         return data;
  //       }),
  //     )
  //     .subscribe(data => (this.data = data));
  // }

  switchView(view: 'table' | 'cards') {
    this.view = view;
  }

}
