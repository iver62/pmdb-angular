import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MovieActor } from '../../../../models';

@Component({
  selector: 'app-roles-table',
  imports: [
    DatePipe,
    MatSortModule,
    MatTableModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.scss'
})
export class RolesTableComponent {

  dataSource = input.required<MovieActor[]>();

  @Input() sortActive: string;
  @Input() sortDirection: SortDirection;

  @Output() sort = new EventEmitter<{ active: string, direction: 'asc' | 'desc' }>();

  displayedColumns = ['role', 'movie.title', 'movie.originalTitle', 'movie.releaseDate'];

  onSort(event: any) {
    this.sort.emit(event);
  }

}
