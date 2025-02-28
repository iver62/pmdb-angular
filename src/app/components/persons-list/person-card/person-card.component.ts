import { Component, Input, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Person } from '../../../models';
import { BaseService } from '../../../services';

@Component({
  selector: 'app-person-card',
  imports: [
    MatCardModule,
    RouterLink
  ],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {

  person = input.required<Person>();

  @Input() service: BaseService;

  constructor(private sanitizer: DomSanitizer) { }

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.service.getPhotoUrl(photoFileName));
  }

}
