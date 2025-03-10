import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PersonSelectorComponent } from '../../../../components';
import { ArtDirectorService, CasterService, CostumierService, DecoratorService, DirectorService, EditorService, HairDresserService, MakeupArtistService, MusicianService, PhotographerService, ProducerService, ScreenwriterService, SoundEditorService, StuntmanService, VisualEffectSupervisorsService } from '../../../../services';

@Component({
  selector: 'app-technical-team-form',
  imports: [
    PersonSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './technical-team-form.component.html',
  styleUrl: './technical-team-form.component.css'
})
export class TechnicalTeamFormComponent {

  @Input() form: FormGroup;

  constructor(
    public directorService: DirectorService,
    public screenwriterService: ScreenwriterService,
    public musicianService: MusicianService,
    public photographerService: PhotographerService,
    public costumierService: CostumierService,
    public decoratorService: DecoratorService,
    public editorService: EditorService,
    public casterService: CasterService,
    public artDirectorService: ArtDirectorService,
    public soundEditorService: SoundEditorService,
    public visualEffectsSupervisorService: VisualEffectSupervisorsService,
    public makeupArtistService: MakeupArtistService,
    public hairDresserService: HairDresserService,
    public stuntmanService: StuntmanService,
    public producerService: ProducerService,
  ) { }
}
