import { HttpResponse } from '@angular/common/http';
import { Component, computed, effect, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { NgPipesModule } from 'ngx-pipes';
import { filter, Observable, take } from 'rxjs';
import { Language, View } from '../../enums';
import { Country, Criterias, SearchConfig, SortOption } from '../../models';
import { CriteriasDialogComponent } from '../criterias-dialog/criterias-dialog.component';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NgPipesModule,
    TranslatePipe
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  countries$ = input<(term: string, page: number, size: number, sort: string, lang: Language) => Observable<HttpResponse<Country[]>>>();
  sorts = input.required<SortOption[]>();
  criterias = input<string[]>([]);
  selectedCriterias = input<Criterias>({} as Criterias);
  cookieName = input<string>();

  selectedSort = computed(() => this.sorts().find(s => ['asc', 'desc'].includes(s.direction)));

  @Output() filter = new EventEmitter();
  @Output() switchView = new EventEmitter<View>();
  @Output() sort = new EventEmitter<SortOption>();

  currentView = View.CARDS;
  view = View;

  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog
  ) {
    effect(() => {
      const cookieValue = this.cookieService.get(this.cookieName());
      if (cookieValue) {
        try {
          const parsedConfig = JSON.parse(cookieValue) as SearchConfig;
          if (parsedConfig?.view) {
            this.currentView = parsedConfig.view;
          }
        } catch (error) {
          console.error("Erreur de parsing du cookie:", error);
          this.currentView = View.CARDS; // Fallback en cas d'erreur
        }
      }
    });
  }

  openCriteriasDialog() {
    this.dialog.open(CriteriasDialogComponent, {
      width: '75vw',  // Définit la largeur à 75% de l'écran
      maxHeight: '90vh', // Définit la hauteur à 90% de l'écran
      data: {
        criterias: this.criterias(),
        selectedCriterias: this.selectedCriterias(),
        countriesObs$: this.countries$()
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
