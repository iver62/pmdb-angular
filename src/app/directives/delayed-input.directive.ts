import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDelayedInput]'
})
export class DelayedInputDirective {

  private destroy$ = new Subject<void>();

  @Input() delayTime = 500;
  @Output() delayedInput = new EventEmitter<string>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  ngOnInit() {
    fromEvent(this.elementRef.nativeElement, 'input')
      .pipe(
        debounceTime(this.delayTime),
        map(event => (event.target as HTMLInputElement).value),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.delayedInput.emit(value));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
