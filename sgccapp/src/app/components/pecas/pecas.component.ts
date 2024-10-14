import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

// Interface para simular o comportamento do model
interface Peca {
  codigo: string;
  descricao: string;
  tipo: string;
  fabricante: string;
  tamanho?: number; // Apenas para peças de memória
}

@Component({
  selector: 'app-pecas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pecas.component.html',
  styleUrls: ['./pecas.component.scss']
})
export class PecasComponent {
  pecas: Peca[] = [
    { codigo: 'PC01', descricao: 'Memória RAM DDR4', tipo: 'Memória RAM', fabricante: 'Kingston', tamanho: 16 },
    { codigo: 'PC02', descricao: 'Processador Intel i7', tipo: 'Processador', fabricante: 'Intel' },
    { codigo: 'PC03', descricao: 'Placa Mãe Gigabyte', tipo: 'Placa Mãe', fabricante: 'Gigabyte' },
    { codigo: 'PC04', descricao: 'Memória Interna SSD', tipo: 'Memória Interna', fabricante: 'Samsung', tamanho: 512 },
  ];

    // Lista com o Conteudo do filtro
  tipo = ['Memória RAM', 'Processador', 'Placa Mãe', 'Memória Interna'];
  fabricante = ['Intel', 'Kingston', 'Gigabyte'];

  selectedTipo: string = '';
  selectedFabricante: string = '';
  searchTerm: string = '';

  // Filtros
  filtros = {
    codigo: '',
    descricao: '',
    tipo: '',
    fabricante: ''
  };

  novaPeca: Peca = {
    codigo: '',
    descricao: '',
    tipo: 'Memória RAM',
    fabricante: '',
    tamanho: undefined
  };

  // Modal para adicionar ou editar
  editMode: boolean = false;
  pecaEmEdicao: Peca | null = null;
  pecaEmExclusao: Peca | null = null;

  private pecaModalInstance: any;
  private confirmacaoAddEditModalInstance: any;

  pecasFiltradas(): Peca[] {
    return this.pecas.filter(peca =>
      (this.filtros.codigo === '' || peca.codigo.toLowerCase().includes(this.filtros.codigo.toLowerCase())) &&
      (this.filtros.descricao === '' || peca.descricao.toLowerCase().includes(this.filtros.descricao.toLowerCase())) &&
      (this.filtros.tipo === '' || peca.tipo.toLowerCase().includes(this.filtros.tipo.toLowerCase())) &&
      (this.filtros.fabricante === '' || peca.fabricante.toLowerCase().includes(this.filtros.fabricante.toLowerCase()))
    );
  }

  // Abre o modal de adicionar/editar
  openModal(editing: boolean = false, peca?: Peca) {
    this.editMode = editing;
    if (editing && peca) {
      // Preenche os campos com os dados da peça para edição
      this.pecaEmEdicao = peca;
      this.novaPeca = { ...peca }; // Clona os dados para edição
    } else {
      // Reseta o formulário para adicionar nova peça
      this.novaPeca = {
        codigo: '',
        descricao: '',
        tipo: 'Memória RAM',
        fabricante: '',
        tamanho: undefined
      };
    }
    this.pecaModalInstance = new bootstrap.Modal(document.getElementById('pecaModal'));
    this.pecaModalInstance.show();
  }

  // Abre o modal de confirmação para adicionar/editar peça
  abrirConfirmacaoModal() {
    this.confirmacaoAddEditModalInstance = new bootstrap.Modal(document.getElementById('confirmacaoAddEditModal'));
    this.confirmacaoAddEditModalInstance.show();
  }

  // Ao confirmar a ação no modal de adição/edição
  onSubmit() {
    if (this.editMode && this.pecaEmEdicao) {
      // Atualiza a peça existente
      Object.assign(this.pecaEmEdicao, this.novaPeca);
    } else {
      // Verifica se o código já existe antes de adicionar
      const pecaExistente = this.pecas.find(p => p.codigo === this.novaPeca.codigo);
      if (!pecaExistente) {
        // Adiciona a nova peça à lista
        this.pecas.push({ ...this.novaPeca });
      }
    }

    // Fecha ambos os modais após salvar
    this.fecharModais();
  }

  fecharModais() {
    if (this.confirmacaoAddEditModalInstance) {
      this.confirmacaoAddEditModalInstance.hide();
    }
    if (this.pecaModalInstance) {
      this.pecaModalInstance.hide();
    }
  }

  // Ação de editar peça
  editarPeca(peca: Peca) {
    this.openModal(true, peca);
  }

  // Abre o modal de confirmação de exclusão
  confirmarExclusao(peca: Peca) {
    this.pecaEmExclusao = peca;
    const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    modal.show();
  }

  // Ação de excluir peça
  excluirPeca() {
    if (this.pecaEmExclusao) {
      this.pecas = this.pecas.filter(p => p.codigo !== this.pecaEmExclusao?.codigo);
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmacaoModal'));
    modal.hide();
  }
}

