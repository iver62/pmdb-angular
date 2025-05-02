import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(value: string, args?: any[]): string {
    if (!value) { return ''; }
    return value.at(0);
  }

}
