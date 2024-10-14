// agency-management.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// models.ts

interface Agencia {
  id: number;
  codigo: string;
  descricao: string;
}

interface Setor {
  id: number;
  codigo: string;
  nome_setor: string;
  id_agencia: number;
  id_servidor: number; // Você pode modificar isso se necessário
  id_sala?: number; // Se a sala não for obrigatória, use '?'
}

interface Servidor {
  id: number;
  codigo: string;
  nome_completo: string;
  data_nascimento: Date;
  id_setor: number;
}

interface Usuario {
  id: number;
  codigo: string;
  senha: string;
  email_institucional: string;
  tipo_usuario: string;
  id_servidor: number;
}

@Component({
  selector: 'app-agencias',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agencias.component.html',
  styleUrl: './agencias.component.css'
})
export class AgenciasComponent {
  agencies: Agencia[] = []; // Especifica que agencies é uma lista de Agencia
  sectors: Setor[] = []; // Especifica que sectors é uma lista de Setor
  selectedAgency: Agencia = { id: 0, codigo: '', descricao: '' }; // Inicializa com uma agência padrão
  selectedSector: Setor = { id: 0, codigo: '', nome_setor: '', id_agencia: 0, id_servidor: 0 }; // Inicializa com um setor padrão

  // Método para salvar agência
  saveAgency() {
    if (this.selectedAgency.id) {
      // Atualiza agência existente
      const index = this.agencies.findIndex(a => a.id === this.selectedAgency.id);
      if (index !== -1) {
        this.agencies[index] = this.selectedAgency;
      }
    } else {
      // Adiciona nova agência
      this.selectedAgency.id = this.agencies.length + 1; // Geração simples de ID
      this.agencies.push(this.selectedAgency);
    }
    this.resetAgencyForm();
  }

  // Método para editar agência
  editAgency(agency: Agencia) {
    this.selectedAgency = { ...agency };
  }

  // Método para excluir agência
  deleteAgency(id: number) {
    this.agencies = this.agencies.filter(a => a.id !== id);
  }

  // Reseta o formulário de agência
  resetAgencyForm() {
    this.selectedAgency = { id: 0, codigo: '', descricao: '' };
  }

  // Método para salvar setor
  saveSector() {
    if (this.selectedSector.id) {
      // Atualiza setor existente
      const index = this.sectors.findIndex(s => s.id === this.selectedSector.id);
      if (index !== -1) {
        this.sectors[index] = this.selectedSector;
      }
    } else {
      // Adiciona novo setor
      this.selectedSector.id = this.sectors.length + 1; // Geração simples de ID
      this.sectors.push(this.selectedSector);
    }
    this.resetSectorForm();
  }

  // Método para editar setor
  editSector(sector: Setor) {
    this.selectedSector = { ...sector };
  }

  // Método para excluir setor
  deleteSector(id: number) {
    this.sectors = this.sectors.filter(s => s.id !== id);
  }

  // Reseta o formulário de setor
  resetSectorForm() {
    this.selectedSector = { id: 0, codigo: '', nome_setor: '', id_agencia: 0, id_servidor: 0 };
  }

  // Método para obter descrição da agência
  getAgencyDescription(agencyId: number): string {
    const agency = this.agencies.find(a => a.id === agencyId);
    return agency ? agency.descricao : 'N/A';
  }
}