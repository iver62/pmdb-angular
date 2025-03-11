import { Component, effect, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { BehaviorSubject } from 'rxjs';
import { EMPTY_STRING } from '../../../../app.component';
import { AutocompleteComponent } from '../../../../components';
import { Person, SearchConfig } from '../../../../models';

@Component({
  selector: 'app-casting-form',
  imports: [
    AutocompleteComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule
  ],
  templateUrl: './casting-form.component.html',
  styleUrl: './casting-form.component.css'
})
export class CastingFormComponent {

  @Input() form: FormGroup;

  searchConfig$ = new BehaviorSubject<SearchConfig>(
    {
      page: 0,
      size: 50,
      sort: 'nomFrFr',
      direction: 'asc',
      term: EMPTY_STRING
    }
  );

  /**
   * Getter pour accéder au FormArray facilement
   */
  get formArray() {
    return this.form.get('actors') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.formArray.length < 1) {
        this.addActor();
      }
    });
  }

  selectActor(event: Person, index: number) {
    this.formArray.at(index).patchValue({ id: event.id, name: event.name });
  }

  /**
   * Fonction pour créer un groupe d'acteur
   */
  createActor() {
    return this.fb.group(
      {
        id: [],
        name: [EMPTY_STRING, Validators.required], // Nom de l'acteur
        role: [EMPTY_STRING, Validators.required]  // Rôle joué dans le film
      }
    );
  }

  /**
   * Ajouter un acteur au FormArray
   */
  addActor() {
    this.formArray.push(this.createActor());
  }

  /**
   * Supprimer un acteur du FormArray
   */
  removeActor(index: number) {
    this.formArray.removeAt(index);
  }

  saveActor(actor: Person, index: number) {
    this.formArray.at(index).patchValue({ id: actor.id })
  }

  moveUp(index: number) {
    if (index > 0) {
      const items = this.formArray.controls;
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
      this.form.setControl('actors', this.fb.array(items));
    }
  }

  moveDown(index: number) {
    if (index < this.formArray.value.length - 1) {
      const items = this.formArray.controls;
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      this.form.setControl('actors', this.fb.array(items));
    }
  }

  clearRole(index: number) {
    this.formArray.at(index).patchValue({ role: null })
  }

}
