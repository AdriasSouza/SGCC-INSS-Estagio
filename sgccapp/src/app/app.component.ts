import { Component, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkmodeService } from './service/darkmode/darkmode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'theme-switcher';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.initializeTheme();
  }

  // Função para inicializar o tema baseado em preferências do usuário
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('auto');
    }
  }

  // Função para alterar o tema
  setTheme(theme: string) {
    const htmlElement = document.documentElement;

    if (theme === 'auto') {
      // Lógica para alternar entre light/dark baseado nas preferências do sistema
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      theme = darkModeQuery.matches ? 'dark' : 'light';
    }

    // Adiciona o tema selecionado ao elemento <html>
    this.renderer.setAttribute(htmlElement, 'data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Evento que altera o tema quando o botão é clicado
  changeTheme(theme: string) {
    this.setTheme(theme);
  }
}
