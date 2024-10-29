import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;

// Interface para simular o comportamento do model
interface Componente {
  codigo: string;
  descricao: string;
  tipo: string;
  fabricante: string;
  numeroSerie: string;
}

interface Equipamento {
  plaqueta: string;
  nome: string;
  componentes: Componente[];
}

interface Manutencao {
  numero: number;
  equipamento: Equipamento;
  responsavel: string;
  data: Date;
  descricao: string;
}

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.scss']
})
export class ManutencaoComponent implements OnInit {
  manutencoes: Manutencao[] = [
    {
      numero: 1,
      equipamento: {
        plaqueta: 'E-001',
        nome: 'Computador Dell',
        componentes: [
          { codigo: 'C-001', descricao: 'Memória RAM', tipo: 'Memória', fabricante: 'Kingston', numeroSerie: '12345' },
          { codigo: 'C-002', descricao: 'HD', tipo: 'Armazenamento', fabricante: 'Seagate', numeroSerie: '67890' }
        ]
      },
      responsavel: 'João Silva',
      data: new Date('2024-01-15'),
      descricao: 'Troca de memória RAM e HD.'
    },
    {
      numero: 2,
      equipamento: {
        plaqueta: 'E-002',
        nome: 'Monitor LG',
        componentes: [
          { codigo: 'C-003', descricao: 'Tela', tipo: 'Display', fabricante: 'LG', numeroSerie: '54321' }
        ]
      },
      responsavel: 'Maria Souza',
      data: new Date('2024-02-12'),
      descricao: 'Substituição da tela.'
    },
    {
      numero: 3,
      equipamento: {
        plaqueta: 'E-003',
        nome: 'Impressora HP',
        componentes: [
          { codigo: 'C-004', descricao: 'Cartucho de Tinta', tipo: 'Consumível', fabricante: 'HP', numeroSerie: '98765' }
        ]
      },
      responsavel: 'Carlos Ferreira',
      data: new Date('2024-03-08'),
      descricao: 'Troca do cartucho de tinta.'
    },
    {
      numero: 4,
      equipamento: {
        plaqueta: 'E-001',
        nome: 'Computador Dell',
        componentes: [
          { codigo: 'C-001', descricao: 'Memória RAM', tipo: 'Memória', fabricante: 'Kingston', numeroSerie: '12345' },
          { codigo: 'C-002', descricao: 'HD', tipo: 'Armazenamento', fabricante: 'Seagate', numeroSerie: '67890' }
        ]
      },
      responsavel: 'Paula Costa',
      data: new Date('2024-04-10'),
      descricao: 'Atualização de software.'
    }
  ];

  equipamentos = ['Computador Dell', 'Monitor LG', 'Impressora HP'];
  responsaveis = ['João Silva', 'Maria Souza', 'Carlos Ferreira', 'Paula Costa'];
  
  manutencoesFiltradas: Manutencao[] = [];
  manutencaoSelecionada: Manutencao | null = null;

  selectedEquipamento: string = '';
  selectedResponsavel: string = '';
  selectedDate: string = '';
  searchTerm: string = '';
  mostrarFiltros: boolean = false;

  currentManutencao: Manutencao | null = null;
  isEditMode: boolean = false;

  ngOnInit(): void {
    this.onFilterChange();
  }

  openManutencaoModal(manutencao: Manutencao) {
    this.manutencaoSelecionada = manutencao;
    const manutencaoModal = new bootstrap.Modal(document.getElementById('manutencaoModal'));
    manutencaoModal.show();
  }

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

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.onFilterChange();
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentManutencao = { numero: 0, equipamento: { plaqueta: '', nome: '', componentes: [] }, responsavel: '', data: new Date(), descricao: '' };
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