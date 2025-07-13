import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { MovieTechnician } from '../../../../../models';

@Component({
  selector: 'app-technicians',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './technicians.component.html',
  styleUrl: './technicians.component.scss'
})
export class TechniciansComponent {

  title = input.required<string>();
  movieTechnicians = input.required<MovieTechnician[]>()

  @Output() edit = new EventEmitter<void>();

  editMovieTechnicians() {
    this.edit.emit();
  }
}
