import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, distinctUntilChanged, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { InputComponent, RolesDialogComponent } from '../../components';
import { SearchConfig, SortOption, User } from '../../models';
import { AuthService, UserService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-users',
  imports: [
    AsyncPipe,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: this.cookieService.get('users-config') ? (JSON.parse(this.cookieService.get('users-config')) as SearchConfig).sort : 'username',
      direction: this.cookieService.get('users-config') ? (JSON.parse(this.cookieService.get('users-config')) as SearchConfig).direction : 'asc',
      term: EMPTY_STRING,
    }
  );

  users$ = this.searchConfig$.pipe(
    distinctUntilChanged((c1, c2) => c1.page == c2.page && c1.size == c2.size && c1.sort == c2.sort && c1.direction == c2.direction && c1.term == c2.term),
    switchMap(config =>
      this.userService.get(config.page, config.size, config.term, config.sort, config.direction).pipe(
        tap(response => this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0)),
        map(response => (response.body ?? [])),
        catchError(error => {
          console.error('Erreur Serveur:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
    )
  );

  duration = 5000;
  displayedColumns = ['id', 'username', 'lastname', 'email', 'emailVerified', 'moviesCount', 'edit_roles'];
  total: number;
  pageSizeOptions = [25, 50, 100];

  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private userService: UserService
  ) { }

  onSort(event: SortOption) {
    this.paginator.firstPage();
    this.updateSearchConfig({ page: 0, sort: event.active, direction: event.direction });
    this.cookieService.set('users-config', JSON.stringify(this.searchConfig$.value), 7);
  }

  onSearch(event: string) {
    if (typeof event == 'string') {
      this.updateSearchConfig({ page: 0, term: event?.trim() })
    };
  }

  onPageChange(event: PageEvent) {
    this.updateSearchConfig({ page: event.pageIndex, size: event.pageSize });
  }

  openRolesDialog(row: User) {
    forkJoin([
      this.authService.getRoles(),
      this.authService.getUserRoles(row.id)
    ]).subscribe(([allRoles, userRoles]) =>
      this.dialog.open(RolesDialogComponent, {
        minWidth: '50vw',  // Définit la largeur à 30% de l'écran
        minHeight: '50vh', // Définit la hauteur à 30% de l'écran
        data: {
          username: row.username,
          roles: allRoles,
          userRoles: userRoles
        }
      }).afterClosed().pipe(
        filter(roles => !!roles), // ignore si null (annulation)
        switchMap(roles => {
          const selectedRoles = Object.entries(roles)
            .filter(([_, checked]) => checked)
            .map(([roleName]) => allRoles.find(r => r.name === roleName))
            .filter(Boolean); // supprime les rôles non trouvés

          return this.authService.updateUserRoles(row.id, selectedRoles);
        })
      ).subscribe(
        {
          next: () => this._snackBar.open(this.translate.currentLang == 'fr' ? 'Rôles modifiés avec succés' : 'Roles modified with success', 'Done', { duration: this.duration }),
          error: () => this._snackBar.open(this.translate.currentLang == 'fr' ? 'Erreur lors de la modification des rôles' : 'Error while updating user roles', 'Error', { duration: this.duration })
        }
      )
    );
  }

  private updateSearchConfig(newConfig: Partial<SearchConfig>) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        ...newConfig
      }
    );
  }

}
