import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkmodeService } from './service/darkmode/darkmode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  darkModeService: DarkmodeService = inject(DarkmodeService);

  toggleDarkMode(){
    this.darkModeService.updateDarkmode();
  }
  title = 'sgccapp';
}
