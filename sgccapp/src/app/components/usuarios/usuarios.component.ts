import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: number;                       // ID do usuário
  codigo: string;                   // Código do usuário
  senha: string;                    // Senha do usuário
  email_institucional: string;      // Email institucional do usuário
  tipo_usuario: string;             // Tipo de usuário
  id_servidor: number;              // ID do servidor associado
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios: Usuario[] = []; // Lista de usuários
  novoUsuario: Usuario = {
    id: 0,
    codigo: '',
    senha: '',
    email_institucional: '',
    tipo_usuario: '',
    id_servidor: 0
  };

  adicionarUsuario() {
    if (this.novoUsuario.codigo && this.novoUsuario.email_institucional) {
      this.novoUsuario.id = this.usuarios.length + 1; // Gerando um ID simples
      this.usuarios.push({ ...this.novoUsuario }); // Adiciona o novo usuário
      this.novoUsuario = { id: 0, codigo: '', senha: '', email_institucional: '', tipo_usuario: '', id_servidor: 0 }; // Reseta o formulário
    }
  }
}
