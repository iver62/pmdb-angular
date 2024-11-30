import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { Person } from '../../../models';
import { MovieService } from '../../../services';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTabsModule, MatIconModule, RouterModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {

  generalInfosForm: Form;
  castingForm: Form;

  movie$ = this.route.paramMap.pipe(
    switchMap(params =>
      forkJoin(
        {
          generalInfos: this.movieService.getOne(Number(params.get('id'))),
          genres: this.movieService.getGenres(Number(params.get('id')))
            .pipe(
              map(result => result.map(genre => genre?.name).join(', '))
            ),
          countries: this.movieService.getCountries(Number(params.get('id')))
            .pipe(
              map(result => result.map(country => country?.nomFrFr).join(', '))
            ),
          producers: this.movieService.getProducers(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          directors: this.movieService.getDirectors(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          screenwriters: this.movieService.getScreenwriters(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          musicians: this.movieService.getMusicians(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          photographers: this.movieService.getPhotographers(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          costumiers: this.movieService.getCostumiers(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          decorators: this.movieService.getDecorators(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            ),
          editors: this.movieService.getEditors(Number(params.get('id')))
            .pipe(
              map(result => result.map(p => this.formatName(p)).join(', '))
            )
        }
      )
    )
  );

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }

  private formatName(person: Person) {
    return `${person?.firstName} ${person?.secondName} ${person?.thirdName} ${person?.lastName}`
  }

  submitGeneralInfos(event: Event) {
    console.log('SUBMIT GENERAL INFOS', event);

  }

}
