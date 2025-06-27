import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { CeremonyAwards } from '../../../../../models';

@Component({
  selector: 'app-ceremony-awards',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './ceremony-awards.component.html',
  styleUrl: './ceremony-awards.component.scss'
})
export class CeremonyAwardsComponent {

  @ViewChildren('textEl') textEls!: QueryList<ElementRef>;

  @Input() ceremonyAwards: CeremonyAwards;
  @Input() editable: boolean;

  @Output() edit = new EventEmitter();

  overflowStates: {
    [key: number]: { scrollingLeft: boolean; scrollingRight: boolean }
  } = {};

  checkOverflow(index: number) {
    const el = this.textEls.get(index)?.nativeElement;
    if (!el) return;

    const isOverflowing = el.scrollWidth > el.parentElement.offsetWidth;
    if (isOverflowing) {
      this.overflowStates[index] = { scrollingLeft: true, scrollingRight: false };

      setTimeout(() => {
        this.overflowStates[index] = { scrollingLeft: false, scrollingRight: true };
      }, 6000); // temps identique à l’animation
    }
  }

  stopAnimation(index: number) {
    this.overflowStates[index] = { scrollingLeft: false, scrollingRight: false };
  }
}
