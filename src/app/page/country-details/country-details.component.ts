import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { catchError, of, switchMap } from 'rxjs';
import { MoviesListComponent, PersonsListComponent } from '../../components';
import { CountryService } from '../../services';

@Component({
  selector: 'app-country-details',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MoviesListComponent,
    NgPipesModule,
    RouterLink,
    PersonsListComponent
  ],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.css'
})
export class CountryDetailsComponent {

  country$ = this.route.paramMap.pipe(
    switchMap(params => this.countryService.getFull(+params.get('id'))),
    catchError(error => {
      console.error('Erreur lors de la récupération du pays:', error);
      return of(null); // Retourne un observable avec null en cas d'erreur
    })
  );

  constructor(
    private countryService: CountryService,
    private route: ActivatedRoute
  ) { }

}
