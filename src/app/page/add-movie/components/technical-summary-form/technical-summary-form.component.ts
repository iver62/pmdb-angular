import { AsyncPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { PersonSelectorComponent } from '../../../../components';
import { Person } from '../../../../models';
import { ArtDirectorService, CasterService, CostumierService, DecoratorService, DirectorService, EditorService, HairDresserService, MakeupArtistService, MusicianService, PhotographerService, ProducerService, ScreenwriterService, SoundEditorService, VisualEffectSupervisorsService } from '../../../../services';

@Component({
  selector: 'app-technical-summary-form',
  imports: [
    AsyncPipe,
    PersonSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './technical-summary-form.component.html',
  styleUrl: './technical-summary-form.component.css'
})
export class TechnicalSummaryFormComponent {

  @Input() formGroupName: string;
  form: FormGroup;

  directors$ = this.directorService.getAll();
  screenwriters$ = this.screenwriterService.getAll();
  musicians$ = this.musicianService.getAll();
  photographers$ = this.photographerService.getAll();
  costumiers$ = this.costumierService.getAll();
  decorators$ = this.decoratorService.getAll();
  editors$ = this.editorService.getAll();
  casters$ = this.casterService.getAll();
  artDirectors$ = this.artDirectorService.getAll();
  soundEditors$ = this.soundEditorService.getAll();
  visualEffectsSupervisors$ = this.visualEffectsSupervisorService.getAll();
  makeupArtists$ = this.makeupArtistService.getAll();
  hairDressers$ = this.hairDresserService.getAll();
  producers$ = this.producerService.getAll();

  saveDirector = (person: Person) => this.directorService.save(person);
  saveScreenwriter = (person: Person) => this.screenwriterService.save(person);
  saveMusician = (person: Person) => this.musicianService.save(person);
  savePhotographer = (person: Person) => this.photographerService.save(person);
  saveCostumier = (person: Person) => this.costumierService.save(person);
  saveDecorator = (person: Person) => this.decoratorService.save(person);
  saveEditor = (person: Person) => this.editorService.save(person);
  saveCaster = (person: Person) => this.casterService.save(person);
  saveArtDirector = (person: Person) => this.artDirectorService.save(person);
  saveSoundEditor = (person: Person) => this.soundEditorService.save(person);
  saveVisualEffectsSupervisor = (person: Person) => this.visualEffectsSupervisorService.save(person);
  saveMakeupArtist = (person: Person) => this.makeupArtistService.save(person);
  saveHairDresser = (person: Person) => this.hairDresserService.save(person);
  saveProducer = (person: Person) => this.producerService.save(person);

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
    public producerService: ProducerService,
    private rootFormGroup: FormGroupDirective
  ) { }

  ngOnInit() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
