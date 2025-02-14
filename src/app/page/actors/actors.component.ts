import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PersonsListComponent } from '../../components';
import { ActorService } from '../../services';

@Component({
    selector: 'app-actors',
    imports: [
        AsyncPipe,
        PersonsListComponent
    ],
    templateUrl: './actors.component.html',
    styleUrl: './actors.component.css'
})
export class ActorsComponent {

    actors$ = this.actorService.getAll();

    constructor(public actorService: ActorService) { }

}
