import { Component, computed, effect, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { ActorService } from '../../../../services';

@Component({
  selector: 'app-casting-form',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './casting-form.component.html',
  styleUrl: './casting-form.component.css'
})
export class CastingFormComponent {

  formGroupName = input.required<string>();
  actorsSignal = toSignal(this.actorService.getAll());
  currentActor = signal<string>('');
  loading = signal(false);

  readonly filteredActors = (index: number) => computed(() =>
    this.actorsSignal()
      ?.filter(actor => actor.name.trim()?.toLowerCase().includes(this.actors.at(index)?.get('name')?.value?.toLowerCase()?.trim()))
  );

  form: FormGroup;

  constructor(
    private actorService: ActorService,
    private fb: FormBuilder,
    private rootFormGroup: FormGroupDirective,
    private sanitizer: DomSanitizer
  ) {
    effect(() => {
      this.form = this.rootFormGroup.control.get(this.formGroupName()) as FormGroup;
      if (this.actors.length < 1) {
        this.addActor();
      }
    });
  }

  /**
   * Getter pour accéder au FormArray facilement
   */
  get actors() {
    return this.form.get('actors') as FormArray;
  }

  /**
   * Fonction pour créer un groupe d'acteur
   */
  createActor(): FormGroup {
    return this.fb.group(
      {
        id: [],
        name: ['', Validators.required], // Nom de l'acteur
        role: ['', Validators.required]  // Rôle joué dans le film
      }
    );
  }

  /**
   * Ajouter un acteur au FormArray
   */
  addActor() {
    this.actors.push(this.createActor());
  }

  /**
   * Supprimer un acteur du FormArray
   */
  removeActor(index: number) {
    this.actors.removeAt(index);
  }

  /**
   * Persister un acteur dans la base de données
   * @param actor l'acteur à persister
   */
  saveActor(actor: AbstractControl, index: number) {
    if (!actor.value.name?.trim()) {
      console.warn("Le nom de l'acteur est vide !");
      return;
    }

    this.loading.set(true);
    this.actorService.save({ name: actor.value.name?.trim() }).subscribe(
      {
        next: result => this.actors.at(index).patchValue({ id: result.id }),
        error: e => console.error(e),
        complete: () => this.loading.set(false)
      }
    );
  }

  clearRole(index: number) {
    this.actors.at(index).patchValue({ role: null })
  }

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.actorService.getPhotoUrl(photoFileName));
  }

}
