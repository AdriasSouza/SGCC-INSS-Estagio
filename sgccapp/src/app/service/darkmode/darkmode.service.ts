import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {

  darkModeSignal = signal<string>("light")

  updateDarkmode(){
    this.darkModeSignal.update((value) => (value === "dark" ? "light" : "dark"))
  }
  constructor() { }
}
