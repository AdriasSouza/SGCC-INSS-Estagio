import { Component, Inject, inject, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DarkmodeService } from './service/darkmode/darkmode.service';
import { EquipamentoComponent } from './components/equipamento/equipamento.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { User } from './model/user.model';
import { ILoginService, LoginService } from './service/login/i-login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, EquipamentoComponent, CommonModule, FormsModule, HttpClientModule], // Adicionando HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'theme-switcher';
  currentUrl = '';
  usuario: User = <User>{};

  darkModeService: DarkmodeService = inject(DarkmodeService); // Injetando o serviço de Darkmode
  currentThemeLabel = 'Toggle theme (auto)'; // Valor inicial como 'auto'
  currentTheme = 'auto'; // Armazena o tema atual // Define o tema inicial como 'auto'
  isEditing: boolean = false; // Propriedades relacionadas ao modal e à edição de campos
  private router: Router = inject(Router); // Injete o serviço de roteamento para poder redirecionar após o logout
  private http: HttpClient = inject(HttpClient); // Injete o HttpClient para fazer chamadas HTTP

  constructor(
    router: Router,
    @Inject(LoginService) private loginService: ILoginService) {

  router.events.subscribe(evento => {
    if (evento instanceof NavigationEnd) {
      this.currentUrl = evento.url;
    }
  });

  this.loginService.usuarioAutenticado.subscribe({
    next: (usuario: User) => {
      this.usuario = usuario;
    }
  });

}

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  // Dados do usuário (podem vir de um serviço no futuro)
  user = {
    fullName: 'João da Silva',
    birthDate: '1990-01-15',
    email: 'joao.silva@instituicao.edu',
    registration: '2023001234'
  };

  // Função para alternar o tema baseado em um string (light, dark, auto)
  toggleTheme(theme: string) {
    this.currentTheme = theme; // Atualiza o tema ativo
    this.darkModeService.setTheme(theme); // Envia o tema selecionado para o serviço
  }

  // Função para habilitar o modo de edição
  editUser() {
    this.isEditing = true;
  }

  // Função para salvar os dados e desabilitar o modo de edição
  saveUser() {
    this.isEditing = false;
    // Aqui você pode implementar a lógica para enviar as alterações ao backend
    console.log('Dados do usuário salvos:', this.user);
  }

  // Função de logout
  confirmLogout() {
    this.http.post('http://127.0.0.1:8000/api/usuarios/logout/', {}).subscribe({
      next: () => {
        localStorage.removeItem('token'); // Remover o token de autenticação
        this.router.navigate(['/login']); // Redirecionar para a página de login
      },
      error: (error) => {
        console.error('Erro ao fazer logout:', error);
      }
    });
  }

  logout(): void {
    this.loginService.logout();
  }

  saveSettings() {
    const language = (document.getElementById('languageSelect') as HTMLSelectElement).value;
    const accessibilityEnabled = (document.getElementById('accessibilityCheck') as HTMLInputElement).checked;
    const notifications = (document.getElementById('notifications') as HTMLSelectElement).value;

    // Aqui você pode implementar a lógica para salvar as configurações
    console.log('Idioma:', language);
    console.log('Acessibilidade:', accessibilityEnabled);
    console.log('Notificações:', notifications);

    // Fechar o modal após salvar
    this.closeSettingsModal();
  }

  closeSettingsModal() {
    const modal = document.getElementById('settingsModal') as any;
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  }
}