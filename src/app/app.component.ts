import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { UserDialogComponent } from './components';
import { AuthService, LoaderService } from './services';

export const EMPTY_STRING = '';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    NgPipesModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PMDB';

  loading$: Observable<boolean>;

  mobileQuery: MediaQueryList;

  navs = [
    {
      label: 'Accueil',
      routerLink: 'dashboard',
      active: true
    },
    {
      label: 'Films',
      routerLink: 'movies',
      active: true
    },
    {
      label: 'Acteurs',
      routerLink: 'actors',
      active: true
    },
    {
      label: 'Producteurs',
      routerLink: 'producers',
      active: true
    },
    {
      label: 'Réalisateurs',
      routerLink: 'directors',
      active: true
    },
    {
      label: 'Scénaristes',
      routerLink: 'screenwriters',
      active: true
    },
    {
      label: 'Musique',
      routerLink: 'musicians',
      active: true
    },
    {
      label: 'Décors',
      routerLink: 'decorators',
      active: true
    },
    {
      label: 'Costumes',
      routerLink: 'costumiers',
      active: true
    },
    {
      label: 'Photographie',
      routerLink: 'photographers',
      active: true
    },
    {
      label: 'Montage',
      routerLink: 'editors',
      active: true
    },
    {
      label: 'Casteurs',
      routerLink: 'casters',
      active: true
    },
    {
      label: 'Directeurs artistiques',
      routerLink: 'art-directors',
      active: true
    },
    {
      label: 'Ingénieurs du son',
      routerLink: 'sound-editors',
      active: true
    },
    {
      label: 'Spécialiste effets spéciaux',
      routerLink: 'visual-effects-supervisors',
      active: true
    },
    {
      label: 'Maquilleurs',
      routerLink: 'makeup-artists',
      active: true
    },
    {
      label: 'Coiffeurs',
      routerLink: 'hair-dressers',
      active: true
    },
    {
      label: 'Cascadeurs',
      routerLink: 'stuntmen',
      active: true
    },
    {
      label: 'Genres',
      routerLink: 'genres',
      active: false
    },
    {
      label: 'Pays',
      routerLink: 'countries',
      active: false
    },
    {
      label: 'Utilisateurs',
      routerLink: 'users',
      active: true
    }
  ];

  private _mobileQueryListener: () => void;

  user$ = this.authService.loadUserProfile();

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    media: MediaMatcher,
  ) {
    this.loading$ = this.loaderService.loading$;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  openProfileDialog() {
    this.dialog.open(UserDialogComponent, {
      minWidth: '30vw',  // Définit la largeur à 75% de l'écran
      minHeight: '30vh', // Définit la hauteur à 90% de l'écran
      data: this.user$
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
