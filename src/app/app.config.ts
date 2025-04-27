import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'moment/locale/fr'; // Importation explicite de la locale française pour Moment.js
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideKeycloakAngular } from '../keycloak-init';
import { routes } from './app.routes';
import { getFrenchPaginatorIntl } from './custom-paginator';
import { authInterceptor, loaderInterceptor } from './interceptors';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'L' // Format de saisie (ex: 25/02/2025)
  },
  display: {
    dateInput: 'L', // Format d'affichage (ex: 25/02/2025)
    monthYearLabel: 'MMM YYYY', // Label du mois et de l'année (ex: févr. 2025)
    dateA11yLabel: 'L', // Accessibilité : affichage complet (ex: 25 février 2025)
    monthYearA11yLabel: 'MMMM YYYY' // Accessibilité : mois + année (ex: février 2025)
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([authInterceptor, loaderInterceptor])
    ),
    provideTranslateService({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideKeycloakAngular(),
    provideCharts(withDefaultRegisterables()),
    provideRouter(routes),
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr' }
  ]
};
