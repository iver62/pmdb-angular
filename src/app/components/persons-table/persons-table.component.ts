import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { Person, PersonWithPhotoUrl } from '../../models';
import { AuthService, PersonService } from '../../services';

@Component({
  selector: 'app-persons-table',
  imports: [
    AsyncPipe,
    DatePipe,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgPipesModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './persons-table.component.html',
  styleUrl: './persons-table.component.scss'
})
export class PersonsTableComponent {

  dataSource = input.required<Person[]>();
  enrichedPersons = signal<PersonWithPhotoUrl[]>([]);

  @Input() sortActive: string;
  @Input() sortDirection: SortDirection;

  @Output() sort = new EventEmitter<{ active: string, direction: 'asc' | 'desc' }>();
  @Output() delete = new EventEmitter<Person>();

  displayedColumns = ['photo', 'name', 'dateOfBirth', 'dateOfDeath', 'moviesCount', 'awardsCount', 'types', 'creationDate', 'lastUpdate'];

  constructor(
    public authService: AuthService,
    private personService: PersonService,
    private router: Router
  ) {
    // Transformer les films en ajoutant les URLs
    effect(() => {
      const persons = this.dataSource()?.map(p => (
        {
          ...p,
          photoUrl$: this.personService.getPhotoUrl(p.photoFileName) // Observable pour la photo
        }
      ));
      this.enrichedPersons.set(persons);
    });
  }

  onSort(event: any) {
    this.sort.emit(event);
  }

  editPerson(person: Person) {
    this.router.navigateByUrl(`/persons/${person.id}`);
  }

  deletePerson(person: Person) {
    this.delete.emit(person);
  }
}