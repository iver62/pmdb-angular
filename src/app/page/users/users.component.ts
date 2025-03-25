import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../app.component';
import { InputComponent } from '../../components';
import { SearchConfig, SortOption } from '../../models';
import { UserService } from '../../services';
import { HttpUtils } from '../../utils';

@Component({
  selector: 'app-users',
  imports: [
    AsyncPipe,
    InputComponent,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
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

  displayedColumns = ['username', 'name', 'email', 'emailVerified', 'numberOfMovies'];
  total: number;
  pageSizeOptions = [25, 50, 100];

  constructor(
    private cookieService: CookieService,
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

  private updateSearchConfig(newConfig: Partial<SearchConfig>) {
    this.searchConfig$.next(
      {
        ...this.searchConfig$.value,
        ...newConfig
      }
    );
  }

}
