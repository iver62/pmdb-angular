import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CountrySelectorComponent, GenreSelectorComponent } from '../../../../components';
import { Genre } from '../../../../models';
import { GenreService } from '../../../../services';

@Component({
  selector: 'app-general-infos-form',
  imports: [
    CountrySelectorComponent,
    GenreSelectorComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './general-infos-form.component.html',
  styleUrl: './general-infos-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfosFormComponent {

  @Input() formGroupName: string;

  @Output() change = new EventEmitter();

  form: FormGroup;
  genres: Genre[] = [];

  constructor(
    private genreService: GenreService,
    private rootFormGroup: FormGroupDirective
  ) { }

  ngOnInit() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.genreService.getAll().subscribe(result => this.genres = result);
  }

  get titleFormCtrl() {
    return this.form.get('title');
  }

  addGenre(event: Genre) {
    this.genres.push(event);
  }

}
