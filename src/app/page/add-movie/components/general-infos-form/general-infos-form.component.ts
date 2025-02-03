import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CountrySelectorComponent, GenreSelectorComponent } from '../../../../components';
import { Genre } from '../../../../models';
import { GenreService } from '../../../../services';

@Component({
  selector: 'app-general-infos-form',
  imports: [
    CountrySelectorComponent,
    GenreSelectorComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './general-infos-form.component.html',
  styleUrl: './general-infos-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfosFormComponent {

  formGroupName = input.required<string>();
  form: FormGroup;
  genres: Genre[] = [];
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  @Output() selectImage = new EventEmitter<File>();

  constructor(
    private genreService: GenreService,
    private rootFormGroup: FormGroupDirective
  ) {
    effect(() => this.form = this.rootFormGroup.control.get(this.formGroupName()) as FormGroup);
  }

  ngOnInit() {
    this.genreService.getAll().subscribe(result => this.genres = result);
  }

  get titleFormCtrl() {
    return this.form.get('title');
  }

  get posterFormCtrl() {
    return this.form.get('poster');
  }

  addGenre(event: Genre) {
    this.genres.push(event);
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectImage.emit(this.selectedFile);
      this.selectedFileName = this.selectedFile.name;
      this.posterFormCtrl.setValue(this.selectedFileName);
    }
  }

  deleteFile() {
    this.posterFormCtrl.reset();
    this.selectImage.emit(null);
  }

}
