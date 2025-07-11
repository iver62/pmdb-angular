import { Injectable } from '@angular/core';
import moment, { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  format(date: Moment | Date | string, format: string) {
    return moment(date).format(format);
  }
}
