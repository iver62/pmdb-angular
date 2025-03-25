import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Person } from '../../models';
import { BaseService } from '../../services';

@Component({
  selector: 'app-persons-table',
  imports: [
    DatePipe,
    MatSortModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './persons-table.component.html',
  styleUrl: './persons-table.component.css'
})
export class PersonsTableComponent {

  @Input() service: BaseService;
  @Input() dataSource: Person[];
  @Input() sortActive: string;
  @Input() sortDirection: SortDirection;

  @Output() sort = new EventEmitter<{ active: string, direction: 'asc' | 'desc' }>();

  displayedColumns = ['photo', 'name', 'dateOfBirth', 'dateOfDeath', 'numberOfMovies', 'creationDate', 'lastUpdate'];

  constructor(private sanitizer: DomSanitizer) { }

  onSort(event: any) {
    this.sort.emit(event);
  }

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.service.getPhotoUrl(photoFileName));
  }
}
