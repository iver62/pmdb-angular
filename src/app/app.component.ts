import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { map, Observable, startWith } from 'rxjs';
import { Language } from './enums';
import { FirstLetterPipe } from './pipes';
import { AuthService, LoaderService } from './services';

export const EMPTY_STRING = '';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    FirstLetterPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    NgPipesModule,
    RouterLink,
    RouterOutlet,
    TranslatePipe,
    UpperCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PMDB';

  isDarkMode = false;

  loading$: Observable<boolean>;
  currentLang$ = this.translate.onLangChange.pipe(
    map(result => result.lang),
    startWith(localStorage.getItem('lang'))
  );

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  user$ = this.authService.loadUserProfile();

  constructor(
    public authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    private dateAdapter: DateAdapter<any>,
    private loaderService: LoaderService,
    media: MediaMatcher,
    private translate: TranslateService
  ) {
    this.loading$ = this.loaderService.loading$;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.translate.onLangChange.subscribe(event => this.dateAdapter.setLocale(event.lang)); // Applique la locale au datepicker

    this.translate.addLangs([Language.EN, Language.FR]);
    this.translate.use(localStorage.getItem('lang') || translate.getDefaultLang() || Language.FR);
  }

  ngOnInit() {
    // Initialisation : vérifier le stockage ou les préférences système
    if (localStorage.getItem('theme') == 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  toggleTheme(theme: 'light' | 'dark') {
    if (theme == 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
