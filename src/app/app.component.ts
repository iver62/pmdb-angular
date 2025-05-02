import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { map, Observable, startWith } from 'rxjs';
import packageJson from '../../package.json';
import { UserDialogComponent } from './components';
import { FirstLetterPipe } from './pipes';
import { AuthService, LoaderService } from './services';

export const EMPTY_STRING = '';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    FirstLetterPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
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

  loading$: Observable<boolean>;
  currentLang$ = this.translate.onLangChange.pipe(
    map(result => result.lang),
    startWith(localStorage.getItem('lang'))
  );

  mobileQuery: MediaQueryList;

  navs = [
    {
      label: 'app.home',
      routerLink: 'dashboard',
      icon: 'dashboard',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.movies',
      routerLink: 'movies',
      icon: 'movie',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.actors',
      routerLink: 'actors',
      icon: 'comedy_mask',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.producers',
      routerLink: 'producers',
      icon: 'attach_money',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.directors',
      routerLink: 'directors',
      icon: 'video_camera_front',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.screenwriters',
      routerLink: 'screenwriters',
      icon: 'edit_square',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.music',
      routerLink: 'musicians',
      icon: 'music_note',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.sets',
      routerLink: 'decorators',
      icon: 'curtains',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.costumes',
      routerLink: 'costumiers',
      icon: 'styler',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.photography',
      routerLink: 'photographers',
      icon: 'photo_camera',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.editing',
      routerLink: 'editors',
      icon: 'cut',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.casters',
      routerLink: 'casters',
      icon: 'theater_comedy',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.art_directors',
      routerLink: 'art-directors',
      icon: 'palette',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.sound_editors',
      routerLink: 'sound-editors',
      icon: 'volume_up',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.visual_effects_supervisors',
      routerLink: 'visual-effects-supervisors',
      icon: 'explosion',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.makeup_artists',
      routerLink: 'makeup-artists',
      icon: 'ink_marker',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.hair_dressers',
      routerLink: 'hair-dressers',
      icon: 'health_and_beauty',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.stuntmen',
      routerLink: 'stuntmen',
      icon: 'sprint',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: true
    },
    {
      label: 'app.categories',
      routerLink: 'genres',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: false
    },
    {
      label: 'app.countries',
      routerLink: 'countries',
      display: this.authService.hasRole('user') || this.authService.hasRole('admin'),
      active: false
    },
    {
      label: 'app.users',
      routerLink: 'users',
      icon: 'account_circle',
      display: this.authService.hasRole('admin') || this.authService.hasRole('admin'),
      active: true
    }
  ];

  appVersion = packageJson.version;

  private _mobileQueryListener: () => void;

  user$ = this.authService.loadUserProfile();

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    media: MediaMatcher,
    private translate: TranslateService
  ) {
    this.loading$ = this.loaderService.loading$;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.translate.addLangs(['en', 'fr']);
    this.translate.use(localStorage.getItem('lang') || 'fr');
  }

  openProfileDialog() {
    this.user$.subscribe(result => {
      this.dialog.open(UserDialogComponent, {
        minWidth: '30vw',  // Définit la largeur à 30% de l'écran
        minHeight: '30vh', // Définit la hauteur à 30% de l'écran
        data: result
      })
    });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
