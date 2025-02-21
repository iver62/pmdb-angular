import { DatePipe } from '@angular/common';
import { Component, effect, EventEmitter, Input, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { Person } from '../../../../models';
import { BaseService } from '../../../../services';
import { PersonUtils } from '../../../../utils';

@Component({
  selector: 'app-person-detail',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    RouterLink
  ],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css'
})
export class PersonDetailComponent {

  @Input() service: BaseService;
  person = input.required<Person>();
  age: number;
  ageOfDeath: number;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {
      this.age = PersonUtils.calculateAge(this.person());
      this.ageOfDeath = new Date(this.person().dateOfDeath)?.getFullYear() - new Date(this.person().dateOfBirth)?.getFullYear();
    })
  }

  getSafePhotoUrl() {
    return this.sanitizer.bypassSecurityTrustUrl(this.service.getPhotoUrl(this.person()?.photoFileName));
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

}
