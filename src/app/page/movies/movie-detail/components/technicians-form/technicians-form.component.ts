import { Component, computed, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Movie, Person, TechnicalSummary } from '../../../../../models';

@Component({
  selector: 'app-technicians-form',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './technicians-form.component.html',
  styleUrl: './technicians-form.component.css'
})
export class TechniciansFormComponent {

  technicalSummary = input.required<TechnicalSummary>()

  readonly filteredProducers = computed(() => {
    // const currentFruit = this.currentFruit().toLowerCase();
    // return currentFruit
    //   ? this.allFruits.filter(fruit => fruit.toLowerCase().includes(currentFruit))
    //   : this.allFruits.slice();
    return [];
  });

  techniciansForm: FormGroup;
  currentProducer: Person;

  @Output() save = new EventEmitter<Movie>();

  constructor(private fb: FormBuilder) {
    effect(() => {
      this.techniciansForm = this.fb.group(
        {
          producersCtrl: [this.technicalSummary().producers],
          // originalTitleCtrl: [this.movie().originalTitle],
          // synopsisCtrl: [this.movie().synopsis],
          // releaseDateCtrl: [this.movie().releaseDate],
          // runningTimeCtrl: [this.movie().runningTime],
          // budgetCtrl: [this.movie().budget],
          // boxOfficeCtrl: [this.movie().boxOffice],
          // posterCtrl: [this.movie().posterPath],
          // genresCtrl: this.fb.array(this.movie().genres),
          // countriesCtrl: this.fb.array(this.movie().countries)
        }
      )
    });
  }

  removeProducer(producer: Person) {
    // this.reactiveKeywords.update(keywords => {
    //   const index = keywords.indexOf(keyword);
    //   if (index < 0) {
    //     return keywords;
    //   }

    //   keywords.splice(index, 1);
    //   this.announcer.announce(`removed ${keyword} from reactive form`);
    //   return [...keywords];
    // });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    // const value = (event.value || '').trim();

    // // Add our keyword
    // if (value) {
    //   this.reactiveKeywords.update(keywords => [...keywords, value]);
    //   this.announcer.announce(`added ${value} to reactive form`);
    // }

    // // Clear the input value
    // event.chipInput!.clear();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // this.fruits.update(fruits => [...fruits, event.option.viewValue]);
    // this.currentFruit.set('');
    // event.option.deselect();
  }

  onSubmit(event: any) { }

}
