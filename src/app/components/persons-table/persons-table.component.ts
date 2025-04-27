import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Person, PersonWithPhotoUrl } from '../../models';
import { BaseService } from '../../services';

@Component({
  selector: 'app-persons-table',
  imports: [
    AsyncPipe,
    DatePipe,
    MatSortModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './persons-table.component.html',
  styleUrl: './persons-table.component.css'
})
export class PersonsTableComponent {

  dataSource = input.required<Person[]>();
  enrichedPersons = signal<PersonWithPhotoUrl[]>([]);

  @Input() service: BaseService;
  @Input() sortActive: string;
  @Input() sortDirection: SortDirection;

  @Output() sort = new EventEmitter<{ active: string, direction: 'asc' | 'desc' }>();

  displayedColumns = ['photo', 'name', 'dateOfBirth', 'dateOfDeath', 'moviesCount', 'creationDate', 'lastUpdate'];

  constructor() {
    // Transformer les films en ajoutant les URLs
    effect(() => {
      const persons = this.dataSource()?.map(p => (
        {
          ...p,
          photoUrl$: this.service.getPhotoUrl(p.photoFileName) // Observable pour la photo
        }
      ));
      this.enrichedPersons.set(persons);
    });
  }

  onSort(event: any) {
    this.sort.emit(event);
  }
}