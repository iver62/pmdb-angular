import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  styleUrl: './input.component.css'
})
export class InputComponent {

  @Input() label: string;
  @Input() total: number;

  @Output() change = new EventEmitter<string>();

  pattern: string;

  clearSearch() {
    console.log('CLEAR');

    this.pattern = '';
    this.change.emit(this.pattern);
  }

  onSearch() {
    console.log('SEARCH');

    this.change.emit(this.pattern);
  }

}
