import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EMPTY_STRING } from '../../app.component';
import { DelayedInputDirective } from '../../directives';

@Component({
  selector: 'app-input',
  imports: [
    DelayedInputDirective,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() total: number;

  @Output() change = new EventEmitter<string>();

  pattern: string;

  clearSearch() {
    this.pattern = EMPTY_STRING;
    this.change.emit(this.pattern);
  }

  onSearch() {
    this.change.emit(this.pattern);
  }

}
