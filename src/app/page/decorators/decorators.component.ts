import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { DecoratorService } from '../../services';

@Component({
  selector: 'app-decorators',
  imports: [
    AsyncPipe,
    PersonsListComponent
  ],
  templateUrl: './decorators.component.html',
  styleUrl: './decorators.component.css'
})
export class DecoratorsComponent {

  decorators$ = this.decoratorService.getAll();

  constructor(public decoratorService: DecoratorService) { }

}
