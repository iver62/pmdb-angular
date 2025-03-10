import { AsyncPipe } from '@angular/common';
import { Component, effect, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, catchError, map, of, scan, switchMap, tap } from 'rxjs';
import { EMPTY_STRING } from '../../../../app.component';
import { DelayedInputDirective } from '../../../../directives';
import { Person, SearchConfig } from '../../../../models';
import { ActorService } from '../../../../services';
import { HttpUtils } from '../../../../utils';

@Component({
  selector: 'app-casting-form',
  imports: [
    AsyncPipe,
    DelayedInputDirective,
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

  @ViewChild('auto', { read: MatAutocomplete }) matAutocomplete: MatAutocomplete;

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

  // Liste des acteurs filtrés
  readonly actors$ = this.searchConfig$.pipe(
    tap(() => this.isLoadingMore = true),
    switchMap(config => this.actorService.get(config.page, config.size, config.term).pipe(
      tap(response => {
        this.isLoadingMore = false;
        this.total = +(response.headers.get(HttpUtils.X_TOTAL_COUNT) ?? 0);
      }),
      map(response => response.body.filter(actor => !this.formArray?.value?.find((a: Person) => a.id == actor.id))),
      catchError(() => {
        this.isLoadingMore = false;
        return of([]);
      })
    )),
    scan((acc: Person[], result: Person[]) => {
      if (this.searchConfig$.value.page == 0) {
        this.loaded = result.length;
        return result;
      } else {
        const newArray = acc.concat(result);
        this.loaded = newArray.length;
        return newArray;
      }
    }, [])
  );

  loading = false;
  total: number;
  loaded = 0;
  private isLoadingMore = false;

  /**
   * Getter pour accéder au FormArray facilement
   */
  get formArray() {
    return this.form.get('actors') as FormArray;
  }

  constructor(
    private actorService: ActorService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    effect(() => {
      if (this.formArray.length < 1) {
        this.addActor();
      }
    });
  }

  ngAfterViewInit() {
    this.matAutocomplete.opened.subscribe(() => {
      setTimeout(() => {
        const panel = document.querySelector('.mat-mdc-autocomplete-panel') as HTMLElement;
        if (panel) {
          panel.addEventListener('scroll', this.onScroll.bind(this));
        }
      }, 100);
    });

    this.matAutocomplete.closed.subscribe(() => {
      const panel = document.querySelector('.mat-mdc-autocomplete-panel') as HTMLElement;
      if (panel) {
        panel.removeEventListener('scroll', this.onScroll.bind(this));
      }
    });
  }

  onOpenedAutocomplete() {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
  }

  onSearch(event: string) {
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: event.trim() });
  }

  private onScroll(event: Event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !this.isLoadingMore && this.loaded + this.formArray.value.length < this.total) {
      this.searchConfig$.next({ ...this.searchConfig$.value, page: this.searchConfig$.value.page + 1 }
      )
    }
  }

  selectActor(event: MatAutocompleteSelectedEvent, index: number) {
    const actor: Person = event.option.value;

    this.formArray.at(index).patchValue({ id: actor.id, name: actor.name });
    this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
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

  /**
   * Persister un acteur dans la base de données
   * @param actor l'acteur à persister
   */
  saveActor(actor: AbstractControl, index: number) {
    if (!actor.value.name?.trim()) {
      console.warn('Le nom de l\'acteur est vide !');
      return;
    }

    this.loading = true;
    this.actorService.save({ name: actor.value.name?.trim() }).subscribe(
      {
        next: result => this.formArray.at(index).patchValue({ id: result.id }),
        error: e => console.error(e),
        complete: () => {
          this.loading = false;
          this.searchConfig$.next({ ...this.searchConfig$.value, page: 0, term: EMPTY_STRING });
        }
      }
    );
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

  getSafePhotoUrl(photoFileName: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.actorService.getPhotoUrl(photoFileName));
  }

}
