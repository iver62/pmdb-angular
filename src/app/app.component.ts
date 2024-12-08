import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterLink, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PMDB';

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
      label: 'Producteurs',
      routerLink: 'producers'
    },
    {
      label: 'Metteurs en scène',
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
      label: 'Acteurs',
      routerLink: 'actors'
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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
