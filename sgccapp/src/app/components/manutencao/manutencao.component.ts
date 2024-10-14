import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Interface para simular o comportamento do model
interface Manutencao {
  numero: number;
  equipamento: { numero: string; nome: string };
  responsavel: string;
  data: Date;
}

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.scss']
})
export class ManutencaoComponent {
  // Items para simular os registros do BD
  manutencoes: Manutencao[] = [
    { numero: 1, equipamento: { numero: 'E-001', nome: 'Computador Dell' }, responsavel: 'João Silva', data: new Date('2024-01-15') },
    { numero: 2, equipamento: { numero: 'E-002', nome: 'Monitor LG' }, responsavel: 'Maria Souza', data: new Date('2024-02-12') },
    { numero: 3, equipamento: { numero: 'E-003', nome: 'Impressora HP' }, responsavel: 'Carlos Ferreira', data: new Date('2024-03-08') },
    { numero: 4, equipamento: { numero: 'E-001', nome: 'Computador Dell' }, responsavel: 'Paula Costa', data: new Date('2024-04-10') },
  ];

  // Lista com o Conteudo do filtro
  equipamentos = ['Computador Dell', 'Monitor LG', 'Impressora HP'];
  responsaveis = ['João Silva', 'Maria Souza', 'Carlos Ferreira', 'Paula Costa'];
  
  manutencoesFiltradas: Manutencao[] = [...this.manutencoes];

  // Filtros
  selectedEquipamento: string = '';
  selectedResponsavel: string = '';
  selectedDate: string = '';
  searchTerm: string = '';

  // Modal para adicionar ou editar
  isEditMode: boolean = false;
  currentManutencao: Manutencao | null = null;

  // Função para atualizar os filtros e busca
  onFilterChange() {
    this.manutencoesFiltradas = this.manutencoes.filter(manutencao => {
      return (!this.selectedEquipamento || manutencao.equipamento.nome === this.selectedEquipamento) &&
             (!this.selectedResponsavel || manutencao.responsavel === this.selectedResponsavel) &&
             (!this.selectedDate || manutencao.data.toISOString().split('T')[0] === this.selectedDate) &&
             (!this.searchTerm || 
               manutencao.numero.toString().includes(this.searchTerm) ||
               manutencao.equipamento.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
               manutencao.responsavel.toLowerCase().includes(this.searchTerm.toLowerCase()));
    });
  }

  // Função para tratar a busca
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.onFilterChange();
  }

  // Funções para adicionar, editar e remover
  openAddModal() {
    this.isEditMode = false;
    this.currentManutencao = { numero: 0, equipamento: { numero: '', nome: '' }, responsavel: '', data: new Date() };
  }

  openEditModal(manutencao: Manutencao) {
    this.isEditMode = true;
    this.currentManutencao = { ...manutencao };
  }

  saveManutencao() {
    if (this.isEditMode) {
      const index = this.manutencoes.findIndex(m => m.numero === this.currentManutencao?.numero);
      if (index !== -1) {
        this.manutencoes[index] = this.currentManutencao as Manutencao;
      }
    } else {
      const newNumero = this.manutencoes.length > 0 ? Math.max(...this.manutencoes.map(m => m.numero)) + 1 : 1;
      this.currentManutencao!.numero = newNumero;
      this.manutencoes.push(this.currentManutencao as Manutencao);
    }
    this.resetModal();
    this.onFilterChange();
  }

  removeManutencao(manutencao: Manutencao) {
    this.manutencoes = this.manutencoes.filter(m => m.numero !== manutencao.numero);
    this.onFilterChange();
  }

  resetModal() {
    this.currentManutencao = null;
    this.isEditMode = false;
  }
}
