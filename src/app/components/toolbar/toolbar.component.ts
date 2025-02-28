import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { View } from '../../enums';
import { SortOption } from '../../models';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  @Input() sorts: SortOption[];

  @Output() switchView = new EventEmitter<View>();
  @Output() sort = new EventEmitter<SortOption>();

  view = View;
  currentView = View.CARDS;

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
