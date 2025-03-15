import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MovieActor } from '../../../../models';
import { ActorService } from '../../../../services';

@Component({
  selector: 'app-casting',
  imports: [RouterLink],
  templateUrl: './casting.component.html',
  styleUrl: './casting.component.css'
})
export class CastingComponent {

  @Input() casting: MovieActor[];

  constructor(
    private actorService: ActorService,
    private sanitizer: DomSanitizer
  ) { }

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.actorService.getPhotoUrl(photoFileName));
  }

}
