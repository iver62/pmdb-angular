import { Component, effect, ElementRef, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { Observable } from 'rxjs';
import { DURATION } from '../../../../app.component';
import { CategorySelectorComponent, CountrySelectorComponent, FileChooserComponent } from '../../../../components';
import { Movie, User } from '../../../../models';
import { MovieService } from '../../../../services';
import { currencies } from '../../../../utils';
import { buildMovieConfig } from './general-infos-form.config';

@Component({
  selector: 'app-general-infos-form',
  imports: [
    CategorySelectorComponent,
    CountrySelectorComponent,
    FileChooserComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgPipesModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './general-infos-form.component.html',
  styleUrl: './general-infos-form.component.scss'
})
export class GeneralInfosFormComponent {

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  movie = input.required<Movie>();
  cancellable = input.required<boolean>();
  user = input<User>();

  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter<Movie>();

  form: FormGroup;
  imageFile: File | null = null;
  currencies = currencies;
  config: {
    service: (file: File, movie: Movie) => Observable<Movie>,
    successMessage: string
  };

  get titleFormCtrl() {
    return this.form.get('title');
  }

  get releaseDateFormCtrl() {
    return this.form.get('releaseDate');
  }

  get posterFormCtrl() {
    return this.form.get('posterFileName');
  }

  get budgetFormGroup() {
    return this.form.get('budget') as FormGroup;
  }

  get boxOfficeFormGroup() {
    return this.form.get('boxOffice') as FormGroup;
  }

  get countriesFormCtrl() {
    return this.form.get('countries') as FormControl;
  }

  get categoriesFormCtrl() {
    return this.form.get('categories') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    effect(() => {
      const movie = this.movie();
      const config = buildMovieConfig(this.movieService);
      this.config = movie.id ? config.update : config.create;

      this.form = this.fb.group(
        {
          id: [movie?.id],
          title: [movie?.title, Validators.required],
          originalTitle: [movie?.originalTitle],
          synopsis: [movie?.synopsis],
          releaseDate: [movie?.releaseDate],
          runningTime: [movie?.runningTime],
          budget: this.fb.group(
            {
              value: [movie?.budget?.value],
              currency: [movie?.budget?.currency]
            }
          ),
          boxOffice: this.fb.group(
            {
              value: [movie?.boxOffice?.value],
              currency: [movie?.boxOffice?.currency]
            }
          ),
          posterFileName: [movie?.posterFileName],
          countries: [movie?.countries ?? []],
          categories: [movie?.categories ?? []],
          user: [movie?.user ?? this.user()]
        }
      );
    });
  }

  ngAfterViewInit() {
    if (this.movie().synopsis) {
      this.autoResize(this.textarea.nativeElement);
    }
  }

  clearDates() {
    this.releaseDateFormCtrl.reset();
    this.releaseDateFormCtrl.markAsDirty();
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'; // Réinitialise la hauteur
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajuste à la bonne taille
  }

  onSelectImage(event: File) {
    this.posterFormCtrl.setValue(event.name);
    this.posterFormCtrl.markAsDirty();
    this.imageFile = event;
  }

  onDeleteImage() {
    this.posterFormCtrl.reset();
    this.posterFormCtrl.markAsDirty();
    this.imageFile = null;
  }

  cancelForm() {
    this.cancel.emit();
  }

  saveGeneralInfos() {
    if (this.form.valid) {
      this.config.service(this.imageFile, this.form.value).subscribe(
        {
          next: result => {
            this.snackBar.open(this.translate.instant(this.config.successMessage), this.translate.instant('app.close'), { duration: DURATION });
            this.save.emit(result);
            this.form.markAsPristine();
          },
          error: error => {
            console.error(error);
            this.snackBar.open(error.error, this.translate.instant('app.close'), { duration: DURATION });
          }
        }
      );
    } else {
      this.snackBar.open(this.translate.instant('app.invalid_form'), this.translate.instant('app.close'), { duration: DURATION });
    }
  }
}
