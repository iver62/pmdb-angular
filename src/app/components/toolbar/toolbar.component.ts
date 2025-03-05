import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Direction, View } from '../../enums';
import { SortOption } from '../../models';
import { FiltersDialogComponent } from '../filters-dialog/filters-dialog.component';
import { NgPipesModule } from 'ngx-pipes';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [
    JsonPipe,
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

  selectedSort = computed(() => this.sorts().find(s => ['asc', 'desc'].includes(s.direction)));

  @Output() filter = new EventEmitter();
  @Output() switchView = new EventEmitter<View>();
  @Output() sort = new EventEmitter<SortOption>();

  view = View;
  currentView = View.CARDS;

  constructor(private dialog: MatDialog) {
    console.log(this.sorts);

  }

  openFiltersDialog() {
    const dialogRef = this.dialog.open(FiltersDialogComponent, {
      width: '75vw',  // Définit la largeur à 80% de l'écran
      maxHeight: '90vh', // Définit la hauteur à 60% de l'écran
    });

    dialogRef.afterClosed().subscribe(result => this.filter.emit(result.value));
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
