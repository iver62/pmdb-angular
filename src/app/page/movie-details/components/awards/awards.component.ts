import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgPipesModule } from 'ngx-pipes';
import { Award } from '../../../../models';

@Component({
  selector: 'app-awards',
  imports: [
    MatIconModule,
    NgPipesModule
  ],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.css'
})
export class AwardsComponent {

  @Input() awards: Award[];
}
