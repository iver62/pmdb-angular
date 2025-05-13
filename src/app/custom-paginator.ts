import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override changes = new Subject<void>();

  constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe(() => this._translateLabels());

    // Initialiser les libellés à la langue actuelle
    this._translateLabels();
  }

  private _translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('app.pagination.itemsPerPage');
    this.nextPageLabel = this.translate.instant('app.pagination.nextPage');
    this.previousPageLabel = this.translate.instant('app.pagination.previousPage');
    this.firstPageLabel = this.translate.instant('app.pagination.firstPage');
    this.lastPageLabel = this.translate.instant('app.pagination.lastPage');
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return this.translate.instant('app.pagination.zeroOf', { length });
      }
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);
      return this.translate.instant('app.pagination.rangeOf', {
        start: startIndex + 1,
        end: endIndex,
        length: length
      });
    };

    this.changes.next(); // mise à jour du composant
  }
}