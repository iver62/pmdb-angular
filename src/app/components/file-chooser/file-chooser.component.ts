import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-file-chooser',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './file-chooser.component.html',
  styleUrl: './file-chooser.component.scss'
})
export class FileChooserComponent {

  accept = input.required<string>();
  formGroupName = input.required<string>();

  control: FormControl;

  @Output() selectImage = new EventEmitter<File>();
  @Output() deleteImage = new EventEmitter();

  constructor(private rootFormGroup: FormGroupDirective) {
    effect(() => this.control = this.rootFormGroup.control.get(this.formGroupName()) as FormControl);
  }

  onFileChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.selectImage.emit(selectedFile);
      this.control.setValue(selectedFile.name);
    }
  }

  deleteFile() {
    this.control.reset();
    this.deleteImage.emit();
  }

}
