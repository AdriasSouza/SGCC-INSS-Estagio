import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// servidor.model.ts
interface Servidor {
  id: number;               // ID do servidor
  codigo: string;          // Código do servidor
  nome_completo: string;   // Nome completo do servidor
  data_nascimento: Date;   // Data de nascimento do servidor
  id_setor: number;        // ID do setor ao qual o servidor pertence
}


@Component({
  selector: 'app-servidores',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './servidores.component.html',
  styleUrls: ['./servidores.component.css']
})
export class ServidoresComponent implements OnInit {
  servidores: Servidor[] = []; // Lista de servidores
  selectedServidor: Servidor = { id: 0, codigo: '', nome_completo: '', data_nascimento: new Date(), id_setor: 0 }; // Inicializa um servidor padrão

  ngOnInit() {
    // Aqui você pode carregar os servidores de um serviço, por exemplo
  }

  // Método para salvar servidor
  saveServidor() {
    if (this.selectedServidor.id) {
      // Atualiza servidor existente
      const index = this.servidores.findIndex(s => s.id === this.selectedServidor.id);
      if (index !== -1) {
        this.servidores[index] = this.selectedServidor;
      }
    } else {
      // Adiciona novo servidor
      this.selectedServidor.id = this.servidores.length + 1; // Geração simples de ID
      this.servidores.push(this.selectedServidor);
    }
    this.resetServidorForm();
  }

  // Método para editar servidor
  editServidor(serv: Servidor) {
    this.selectedServidor = { ...serv };
  }

  // Método para excluir servidor
  deleteServidor(id: number) {
    this.servidores = this.servidores.filter(s => s.id !== id);
  }

  // Reseta o formulário de servidor
  resetServidorForm() {
    this.selectedServidor = { id: 0, codigo: '', nome_completo: '', data_nascimento: new Date(), id_setor: 0 };
  }
}
