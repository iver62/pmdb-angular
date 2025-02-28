import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from './services';

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
      routerLink: 'dashboard'
    },
    {
      label: 'Films',
      routerLink: 'movies'
    },
    {
      label: 'Acteurs',
      routerLink: 'actors'
    },
    {
      label: 'Producteurs',
      routerLink: 'producers'
    },
    {
      label: 'Réalisateurs',
      routerLink: 'directors'
    },
    {
      label: 'Scénaristes',
      routerLink: 'screenwriters'
    },
    {
      label: 'Musique',
      routerLink: 'musicians'
    },
    {
      label: 'Décors',
      routerLink: 'decorators'
    },
    {
      label: 'Costumes',
      routerLink: 'costumiers'
    },
    {
      label: 'Photographie',
      routerLink: 'photographers'
    },
    {
      label: 'Montage',
      routerLink: 'editors'
    },
    {
      label: 'Casteurs',
      routerLink: 'casters'
    },
    {
      label: 'Directeurs artistiques',
      routerLink: 'art-directors'
    },
    {
      label: 'Ingénieurs du son',
      routerLink: 'sound-editors'
    },
    {
      label: 'Spécialiste effets spéciaux',
      routerLink: 'visual-effects-supervisors'
    },
    {
      label: 'Maquilleurs',
      routerLink: 'makeup-artists'
    },
    {
      label: 'Coiffeurs',
      routerLink: 'hair-dressers'
    },
    {
      label: 'Cascadeurs',
      routerLink: 'stuntmen'
    },
    {
      label: 'Genres',
      routerLink: 'genres'
    },
    {
      label: 'Pays',
      routerLink: 'countries'
    }
  ];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    media: MediaMatcher,
  ) {
    this.loading$ = this.loaderService.loading$;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
