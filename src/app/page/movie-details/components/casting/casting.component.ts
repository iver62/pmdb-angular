import { AsyncPipe } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MovieActor, PersonWithPhoto } from '../../../../models';
import { PersonService } from '../../../../services';

@Component({
  selector: 'app-cast',
  imports: [
    AsyncPipe,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './casting.component.html',
  styleUrl: './casting.component.css'
})
export class CastingComponent {

  actors = input.required<MovieActor[]>();
  enrichedActors = signal<PersonWithPhoto[]>([]);

  constructor(private personService: PersonService) {
    // Transformer les acteurs en ajoutant les URLs
    effect(() => {
      const persons = this.actors()?.map(a => (
        {
          ...a,
          photoUrl$: this.personService.getPhotoUrl(a.person.photoFileName) // Observable pour l'affiche
        }
      ));
      this.enrichedActors.set(persons);
    });
  }
}