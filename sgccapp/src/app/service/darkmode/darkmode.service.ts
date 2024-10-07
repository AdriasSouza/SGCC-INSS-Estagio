import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {

    // Signal que armazena o tema atual
    private currentTheme = signal<string>('auto');

    constructor() {
      // Inicializa o tema com base no localStorage ou 'auto'
      const savedTheme = localStorage.getItem('theme') || 'auto';
      this.setTheme(savedTheme);
    }
  
    // Função que retorna o Signal do tema atual
    getTheme(): Signal<string> {
      return this.currentTheme;
    }
  
    // Função que altera o tema e atualiza o Signal
    setTheme(theme: string) {
      this.currentTheme.set(theme);
      
      const htmlElement = document.documentElement;
  
      if (theme === 'auto') {
        // Detecta o tema baseado nas preferências do sistema operacional
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        theme = darkModeQuery.matches ? 'dark' : 'light';
      }
  
      // Adiciona o valor do tema ao atributo data-bs-theme
      htmlElement.setAttribute('data-bs-theme', theme);
      
      // Armazena a escolha do tema no localStorage
      localStorage.setItem('theme', theme);
    }
}
