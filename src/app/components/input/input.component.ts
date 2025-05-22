import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';

@Component({
  selector: 'app-input',
  imports: [
    DelayedInputDirective,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Input() label: string;
  @Input() placeholder: string;
  @Input() total: number;
  @Input() hideable = true;

  @Output() change = new EventEmitter<string>();
  @Output() hide = new EventEmitter();

  pattern: string;

  focus() {
    this.inputRef.nativeElement.focus();
  }

  clearSearch() {
    this.pattern = EMPTY_STRING;
    this.change.emit(this.pattern);
  }

  onSearch() {
    this.change.emit(this.pattern);
  }

  hideField() {
    this.hide.emit();
  }

}
