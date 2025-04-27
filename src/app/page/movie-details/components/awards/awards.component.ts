import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { Award } from '../../../../models';

@Component({
  selector: 'app-awards',
  imports: [
    MatIconModule,
    NgPipesModule,
    TranslatePipe
  ],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.css'
})
export class AwardsComponent {

  @Input() awards: Award[];
}
