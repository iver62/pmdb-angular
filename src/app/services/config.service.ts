import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private darkMode$ = new BehaviorSubject<boolean>(localStorage.getItem('theme') == 'dark');

  get isDarkMode$() {
    return this.darkMode$.asObservable();
  }

  setDarkMode(boolean: boolean) {
    this.darkMode$.next(boolean);
  }
}
