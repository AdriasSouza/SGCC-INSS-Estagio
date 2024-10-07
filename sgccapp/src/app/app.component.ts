import { Component, inject, Renderer2 } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DarkmodeService } from './service/darkmode/darkmode.service';
import { EquipamentoComponent } from './components/equipamentos/equipamento/equipamento.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EquipamentoComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'theme-switcher';
  currentUrl = '';

  // Injetando o serviço de Darkmode
  darkModeService: DarkmodeService = inject(DarkmodeService);

  currentThemeLabel = 'Toggle theme (auto)'; // Valor inicial como 'auto'
  currentTheme = 'auto'; // Armazena o tema atual // Define o tema inicial como 'auto'

  // Função para alternar o tema baseado em um string (light, dark, auto)
  toggleTheme(theme: string) {
    this.currentTheme = theme; // Atualiza o tema ativo
    this.darkModeService.setTheme(theme);  // Envia o tema selecionado para o serviço
  }

}
