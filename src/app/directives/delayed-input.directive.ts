import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { debounce, distinctUntilChanged, fromEvent, Subject, takeUntil, timer } from 'rxjs';

@Directive({
  selector: '[appDelayedInput]'
})
export class DelayedInputDirective {

  private destroy$ = new Subject<void>();

  @Input() delayTime = 500;
  @Output() delayedInput = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  ngOnInit() {
    fromEvent(this.elementRef.nativeElement, 'input')
      .pipe(
        debounce(() => timer(this.delayTime)),
        distinctUntilChanged(
          null,
          (event: Event) => (event.target as HTMLInputElement).value
        ), // 6️⃣
        takeUntil(this.destroy$)
      )
      .subscribe(e => this.delayedInput.emit(e));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
