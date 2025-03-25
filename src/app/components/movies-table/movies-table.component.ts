import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models';
import { MovieService } from '../../services';

@Component({
  selector: 'app-movies-table',
  imports: [
    DatePipe,
    MatSortModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './movies-table.component.html',
  styleUrl: './movies-table.component.css'
})
export class MoviesTableComponent {

  @Input() dataSource: Movie[];
  @Input() sortActive: string;
  @Input() sortDirection: SortDirection;

  @Output() sort = new EventEmitter<{ active: string, direction: 'asc' | 'desc' }>();

  displayedColumns = ['poster', 'title', 'originalTitle', 'releaseDate', 'runningTime', 'budget', 'boxOffice', 'user', 'creationDate', 'lastUpdate'];

  constructor(
    private movieService: MovieService,
    private sanitizer: DomSanitizer
  ) { }

  onSort(event: any) {
    this.sort.emit(event);
  }

  getSafePosterUrl(posterFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.movieService.getPosterUrl(posterFileName));
  }
}
