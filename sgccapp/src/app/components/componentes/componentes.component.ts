import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

declare var bootstrap: any;

// Interface para simular o comportamento do model
interface Componente {
  codigo: string;
  descricao: string;
  tipo: string;
  fabricante: string;
  tamanho?: number; // Apenas para peças de memória
  numeroSerie: string;
}

@Component({
  selector: 'app-componentes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './componentes.component.html',
  styleUrls: ['./componentes.component.scss']
})
export class ComponentesComponent implements OnInit {
  componentes: Componente[] = [
    { codigo: 'PC01', descricao: 'Memória RAM DDR4', tipo: 'Memória RAM', fabricante: 'Kingston', tamanho: 16, numeroSerie: 'SN123' },
    { codigo: 'PC02', descricao: 'Processador Intel i7', tipo: 'Processador', fabricante: 'Intel', numeroSerie: 'SN124' },
    { codigo: 'PC03', descricao: 'Placa Mãe Gigabyte', tipo: 'Placa Mãe', fabricante: 'Gigabyte', numeroSerie: 'SN125' },
    { codigo: 'PC04', descricao: 'Memória Interna SSD', tipo: 'Memória Interna', fabricante: 'Samsung', tamanho: 512, numeroSerie: 'SN126' },
  ];

  // Lista com o Conteudo do filtro
  tipo = ['Memória RAM', 'Processador', 'Placa Mãe', 'Memória Interna'];
  fabricante = ['Intel', 'Kingston', 'Gigabyte'];
  tamanho = ['4', '8', '16'];

  selectedTipo: string = '';
  selectedFabricante: string = '';
  searchTerm: string = '';
  mensagemAlerta: string = '';

  // Filtros
  filtros = {
    codigo: '',
    descricao: '',
    tipo: '',
    fabricante: '',
    tamanho: ''
  };

  busca: string = '';
  componentesFiltradas: Componente[] = [];
  novaComponente: Componente = { codigo: '', descricao: '', tipo: 'Memória RAM', fabricante: '', tamanho: undefined, numeroSerie: '' };
  editMode: boolean = false;
  pecaEmEdicao: Componente | null = null;
  pecaEmExclusao: Componente | null = null;


  private pecaModalInstance: any;
  private confirmacaoAddEditModalInstance: any;
  private alertaAddEditModalInstance: any;
  private alertaModalInstance: any;

  constructor() {}

  ngOnInit(): void {
    // Inicialize a lista de peças aqui
    this.componentesFiltradas = this.componentes;
  }

  atualizarBusca(): void {
    this.componentesFiltradas = this.componentes.filter(peca =>
      (this.busca === '' || peca.codigo.toLowerCase().includes(this.busca.toLowerCase()) ||
        peca.descricao.toLowerCase().includes(this.busca.toLowerCase()) ||
        peca.numeroSerie.toLowerCase().includes(this.busca.toLowerCase())) &&
      (this.filtros.tipo === '' || peca.tipo === this.filtros.tipo) &&
      (this.filtros.fabricante === '' || peca.fabricante === this.filtros.fabricante) &&
      (this.filtros.tamanho === '' || peca.tamanho === +this.filtros.tamanho)
    );
  }

  // Abre o modal de adicionar/editar
  openModal(editing: boolean = false, peca?: Componente) {
    this.editMode = editing;
    if (editing && peca) {
      // Preenche os campos com os dados da peça para edição
      this.pecaEmEdicao = peca;
      this.novaComponente = { ...peca }; // Clona os dados para edição
    } else {
      // Reseta o formulário para adicionar nova peça
      this.novaComponente = {
        codigo: '',
        descricao: '',
        tipo: 'Memória RAM',
        fabricante: '',
        tamanho: undefined,
        numeroSerie: ''
      };
    }
    this.pecaModalInstance = new bootstrap.Modal(document.getElementById('pecaModal'));
    this.pecaModalInstance.show();
  }

  // Abre o modal de confirmação para adicionar/editar peça
  abrirConfirmacaoModal(pecaForm: NgForm): void {
    pecaForm.onSubmit(new Event('submit')); // Marca o formulário como submetido

    if (pecaForm.invalid) {
      return;
    }

    
    if (this.editMode && this.pecaEmEdicao) {
      // Verifica se algum campo foi alterado
      if (JSON.stringify(this.pecaEmEdicao) === JSON.stringify(this.novaComponente)) {
      if (this.pecaModalInstance) {
        this.pecaModalInstance.hide();
      }
      this.mensagemAlerta = 'Nenhuma alteração foi aplicada!';
      this.alertaAddEditModalInstance = new bootstrap.Modal(document.getElementById('alertaModal'));
      this.alertaAddEditModalInstance.show();
      return;
      }
    }

    if (this.pecaModalInstance) {
      this.pecaModalInstance.hide();
    }
    this.confirmacaoAddEditModalInstance = new bootstrap.Modal(document.getElementById('confirmacaoAddEditModal'));
    this.confirmacaoAddEditModalInstance.show();
  }

  // Ao confirmar a ação no modal de adição/edição
  onSubmit(): void {
    if (this.editMode && this.pecaEmEdicao) {
      // Atualiza a peça existente
      Object.assign(this.pecaEmEdicao, this.novaComponente);
      this.exibirAlerta('Peça editada com sucesso!');
    } else {
      // Verifica se o código já existe antes de adicionar
      const pecaExistente = this.componentes.find(p => p.codigo === this.novaComponente.codigo);
      if (!pecaExistente) {
        // Adiciona a nova peça à lista
        this.novaComponente.codigo = `PC${this.componentes.length + 1}`; // Incrementa o código automaticamente
        this.componentes.push({ ...this.novaComponente });
        this.exibirAlerta('Peça adicionada com sucesso!');
      } else {
        this.exibirAlerta('Código de peça já existente!');
      }
    }

    // Atualiza a lista filtrada após adição/edição
    this.atualizarBusca();

    // Fecha ambos os modais após salvar
    this.fecharModais();
  }

  fecharModais(): void {
    if (this.confirmacaoAddEditModalInstance) {
      this.confirmacaoAddEditModalInstance.hide();
    }
    if (this.pecaModalInstance) {
      this.pecaModalInstance.hide();
    }
  }

  // Ação de editar peça
  editarComponente(peca: Componente): void {
    this.openModal(true, peca);
  }

  // Abre o modal de confirmação de exclusão
  confirmarExclusao(peca: Componente): void {
    this.pecaEmExclusao = peca;
    const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    modal.show();
  }

  // Ação de excluir peça
  excluirComponente(): void {
    if (this.pecaEmExclusao) {
      this.componentes = this.componentes.filter(p => p.codigo !== this.pecaEmExclusao?.codigo);
      this.atualizarBusca(); // Atualiza a lista filtrada após exclusão
      this.exibirAlerta('Peça excluída com sucesso!');
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmacaoModal'));
    modal.hide();
  }

  // Volta para o modal de adicionar/editar peça
  voltarParaModalComponente(): void {
    if (this.confirmacaoAddEditModalInstance) {
      this.confirmacaoAddEditModalInstance.hide();
    }
    if (this.pecaModalInstance) {
      this.pecaModalInstance.show();
    }
  }

  // Exibe o modal de alerta
  exibirAlerta(mensagem: string): void {
    this.mensagemAlerta = mensagem;
    this.alertaModalInstance = new bootstrap.Modal(document.getElementById('alertaModal'));
    this.alertaModalInstance.show();
  }

  // Cancela a operação e exibe o alerta
  cancelarOperacao(): void {
    this.exibirAlerta('Operação cancelada pelo usuário.');
  }
}