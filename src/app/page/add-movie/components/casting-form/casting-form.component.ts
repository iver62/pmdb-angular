import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, effect, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { EMPTY_STRING } from '../../../../app.component';
import { AutocompleteComponent } from '../../../../components';
import { PersonType } from '../../../../enums';
import { Person } from '../../../../models';
import { PersonService } from '../../../../services';

@Component({
  selector: 'app-casting-form',
  imports: [
    AutocompleteComponent,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './casting-form.component.html',
  styleUrl: './casting-form.component.scss'
})
export class CastingFormComponent {

  @Input() form: FormGroup;

  /**
   * Getter pour accéder au FormArray facilement
   */
  get formArray() {
    return this.form.get('actors') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    effect(() => {
      if (this.formArray.length < 1) {
        this.addActor();
      }
    });
  }

  selectActor(person: Person, index: number) {
    this.formArray.at(index).patchValue({ id: person.id, name: person.name });
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

  addType(person: Person) {
    if (!person.types.includes(PersonType.ACTOR)) {
      this.personService.addPersonType(person.id, PersonType.ACTOR).subscribe();
    }
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

  clearRole(index: number) {
    this.formArray.at(index).patchValue({ role: null })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
    this.formArray.updateValueAndValidity();
  }

}
