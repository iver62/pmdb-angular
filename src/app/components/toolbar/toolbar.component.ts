import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { filter, take } from 'rxjs';
import { View } from '../../enums';
import { Criterias, SortOption } from '../../models';
import { CriteriasDialogComponent } from '../criterias-dialog/criterias-dialog.component';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NgPipesModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  sorts = input.required<SortOption[]>();
  criterias = input.required<string[]>();
  selectedCriterias = input<Criterias>();

  selectedSort = computed(() => this.sorts().find(s => ['asc', 'desc'].includes(s.direction)));

  @Output() filter = new EventEmitter();
  @Output() switchView = new EventEmitter<View>();
  @Output() sort = new EventEmitter<SortOption>();

  view = View;
  currentView = View.CARDS;

  constructor(private dialog: MatDialog) { }

  openCriteriasDialog() {
    this.dialog.open(CriteriasDialogComponent, {
      width: '75vw',  // Définit la largeur à 75% de l'écran
      maxHeight: '90vh', // Définit la hauteur à 90% de l'écran
      data: {
        criterias: this.criterias(),
        selectedCriterias: this.selectedCriterias()
      }
    }).afterClosed().pipe(
      filter(result => result != null && result.value != null),
      take(1) // Assure qu'on ne prend que le premier résultat et que l'abonnement se termine automatiquement
    ).subscribe(result => this.filter.emit(result.value));
  }

  onSwitchView(view: View) {
    this.currentView = view;
    this.switchView.emit(view);
  }

  onSelectSort(selectedSort: SortOption) {
    this.sort.emit(
      {
        active: selectedSort.active,
        direction: selectedSort.direction === 'asc' ? 'desc' : 'asc'
      }
    );
  }

}
