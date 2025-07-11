import { Component, input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslatePipe } from '@ngx-translate/core';
import { CeremonyAwards } from '../../../../models';
import { CeremonyAwardsFormComponent } from "./ceremony-awards-form/ceremony-awards-form.component";

@Component({
  selector: 'app-awards-form',
  imports: [
    CeremonyAwardsFormComponent,
    MatAutocompleteModule,
    TranslatePipe
  ],
  templateUrl: './awards-form.component.html',
  styleUrl: './awards-form.component.scss'
})
export class AwardsFormComponent {

  movieId = input.required<number>();
  ceremoniesAwards = input<CeremonyAwards[]>();
  cancellable = input<boolean>(true);

  addCeremony() {
    this.ceremoniesAwards().push(
      {
        ceremony: null,
        awards: []
      }
    );
  }

  save(ceremonyAwards: CeremonyAwards, index: number) {
    this.ceremoniesAwards()[index] = ceremonyAwards;
  }

  deleteCeremonyAwards(index: number) {
    this.ceremoniesAwards().splice(index, 1);
  }
}
