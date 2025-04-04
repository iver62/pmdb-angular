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
      icon: 'dashboard',
      active: true
    },
    {
      label: 'Films',
      routerLink: 'movies',
      icon: 'movie',
      active: true
    },
    {
      label: 'Acteurs',
      routerLink: 'actors',
      icon: 'comedy_mask',
      active: true
    },
    {
      label: 'Producteurs',
      routerLink: 'producers',
      icon: 'attach_money',
      active: true
    },
    {
      label: 'Réalisateurs',
      routerLink: 'directors',
      icon: 'video_camera_front',
      active: true
    },
    {
      label: 'Scénaristes',
      routerLink: 'screenwriters',
      icon: 'edit_square',
      active: true
    },
    {
      label: 'Musique',
      routerLink: 'musicians',
      icon: 'music_note',
      active: true
    },
    {
      label: 'Décors',
      routerLink: 'decorators',
      icon: 'curtains',
      active: true
    },
    {
      label: 'Costumes',
      routerLink: 'costumiers',
      icon: 'styler',
      active: true
    },
    {
      label: 'Photographie',
      routerLink: 'photographers',
      icon: 'photo_camera',
      active: true
    },
    {
      label: 'Montage',
      routerLink: 'editors',
      icon: 'cut',
      active: true
    },
    {
      label: 'Casteurs',
      routerLink: 'casters',
      icon: 'theater_comedy',
      active: true
    },
    {
      label: 'Directeurs artistiques',
      routerLink: 'art-directors',
      icon: 'palette',
      active: true
    },
    {
      label: 'Ingénieurs du son',
      routerLink: 'sound-editors',
      icon: 'volume_up',
      active: true
    },
    {
      label: 'Spécialiste effets spéciaux',
      routerLink: 'visual-effects-supervisors',
      icon: 'explosion',
      active: true
    },
    {
      label: 'Maquilleurs',
      routerLink: 'makeup-artists',
      icon: 'ink_marker',
      active: true
    },
    {
      label: 'Coiffeurs',
      routerLink: 'hair-dressers',
      icon: 'health_and_beauty',
      active: true
    },
    {
      label: 'Cascadeurs',
      routerLink: 'stuntmen',
      icon: 'sprint',
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
      icon: 'account_circle',
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
