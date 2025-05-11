import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoaderService } from '../services';

const urlsToExclude = [
  `${environment.apiBaseUrl}/stats`,
];

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Vérifie si l'URL de la requête est dans la liste d'exclusion
  const shouldSkipLoader = urlsToExclude.some(url => req.url.startsWith(url));

  if (!shouldSkipLoader) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkipLoader) {
        loaderService.hide(); // Cache le spinner après la requête
      }
    })
  );
}