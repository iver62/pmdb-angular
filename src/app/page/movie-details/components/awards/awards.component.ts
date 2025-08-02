import { Component, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { DURATION } from '../../../../app.component';
import { CeremonyAwards } from '../../../../models';
import { AuthService, MovieService } from '../../../../services';
import { CeremonyAwardsFormComponent } from "../../../add-movie/components/awards-form/ceremony-awards-form/ceremony-awards-form.component";
import { CeremonyAwardsComponent } from "./ceremony-awards/ceremony-awards.component";

@Component({
  selector: 'app-awards',
  imports: [
    CeremonyAwardsComponent,
    CeremonyAwardsFormComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgPipesModule,
    TranslatePipe
  ],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.css'
})
export class AwardsComponent {

  movieId = input.required<number>();
  ceremoniesAwards = input.required<CeremonyAwards[]>();

  editGroupAwards = signal<boolean[]>([]);

  localCeremoniesAwards: CeremonyAwards[];

  constructor(
    public authService: AuthService,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    effect(() => {
      this.localCeremoniesAwards = this.ceremoniesAwards();
      this.editGroupAwards.set(new Array(this.localCeremoniesAwards.length).fill(false));
    });
  }

  edit(index: number) {
    this.editGroupAwards.update(state => {
      const newState = [...state];
      newState[index] = true;
      return newState;
    });
  }

  save(event: CeremonyAwards, index: number) {
    this.editGroupAwards.update(state => {
      const newState = [...state];
      newState[index] = false;
      return newState;
    });

    this.localCeremoniesAwards = this.localCeremoniesAwards.map((item, i) =>
      i === index ? event : item
    );
  }

  cancel(index: number) {
    this.editGroupAwards.update(state => {
      const newState = [...state];
      newState[index] = false;
      return newState;
    });
  }

  addCeremony() {
    this.localCeremoniesAwards.push(
      {
        ceremony: { name: null }
      }
    );

    // Déclenche le re-render
    this.localCeremoniesAwards = [...this.localCeremoniesAwards];

    this.editGroupAwards.update(state => {
      const newState = [...state];
      newState.push(true);
      return newState;
    });
  }

  cancelEdit(index: number) {
    this.editGroupAwards.update(state => {
      const newState = [...state];
      newState[index] = false;
      return newState;
    });
  }

  deleteCeremonyAwards(ceremonyAwardsId: number, index: number) {
    if (ceremonyAwardsId) {
      this.movieService.deleteCeremonyAwards(this.movieId(), ceremonyAwardsId).subscribe(
        {
          next: () => this.snackBar.open(this.translate.instant('app.ceremony_deleted_success'), this.translate.instant('app.close'), { duration: DURATION }),
          error: error => {
            console.error(error);
            this.snackBar.open(error.error, this.translate.instant('app.close'), { duration: DURATION });
          }
        }
      );
    }

    this.localCeremoniesAwards.splice(index, 1);
    this.localCeremoniesAwards = [...this.localCeremoniesAwards];
    this.editGroupAwards.update(state => {
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    });
  }

}
