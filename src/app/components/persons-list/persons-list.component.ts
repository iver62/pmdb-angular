import { Component, computed, Input, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { Person } from '../../models';
import { BaseService } from '../../services';
import { PersonCardComponent } from './person-card/person-card.component';

@Component({
  selector: 'app-persons-list',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NgPipesModule,
    PersonCardComponent
  ],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css'
})
export class PersonsListComponent {

  title = input.required<string>();
  persons = input.required<Person[]>();
  route = input.required<string>();

  @Input() service: BaseService;

  filteredPersons = computed(() => {
    const term = this.searchTermSignal().toLowerCase();

    // Si le terme de recherche est vide, retourner toutes les personnes
    if (!term) {
      return this.persons();
    }

    // Sinon, filtrer les personnes
    return this.persons().filter(person => person.name.toLowerCase().includes(term));
  });

  searchTermSignal = signal('');

  view: 'table' | 'cards' = 'cards';

  switchView(view: 'table' | 'cards') {
    this.view = view;
  }

  // Getter pour le signal
  get searchTerm(): string {
    return this.searchTermSignal();
  }

  // Setter pour le signal
  set searchTerm(value: string) {
    this.searchTermSignal.set(value);
  }

  // Effacer la recherche
  clearSearch(): void {
    this.searchTermSignal.set('');
  }

}
