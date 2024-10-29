import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

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
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
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
  busca: string = '';

  // Filtros
  filtros = {
    codigo: '',
    descricao: '',
    tipo: '',
    fabricante: '',
    tamanho: ''
  };

  componentesFiltradas: Componente[] = [];
  componenteParaExcluir: Componente | null = null;
  componenteParaEditar: Componente | null = null;
  tipoSelecionado: string = '';
  editTipoSelecionado: string = '';
  editIndex: number | null = null;
  editForm: FormGroup;
  novaComponente: Componente = { codigo: '', descricao: '', tipo: 'Memória RAM', fabricante: '', tamanho: undefined, numeroSerie: '' };
  isEditMode = false;
  currentComponente: any = {};
  mostrarFiltros: boolean = false;



  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      descricao: ['', Validators.required],
      tipo: ['', Validators.required],
      tamanho: [''],
      numeroSerie: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.componentesFiltradas = this.componentes;
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
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

  // Funções dos Modais
  
  // Modal de Delete
  openDeleteModal(componente: Componente) {
    this.componenteParaExcluir = componente;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.componenteParaExcluir) {
      const index = this.componentesFiltradas.indexOf(this.componenteParaExcluir);
      if (index > -1) {
        this.componentesFiltradas.splice(index, 1);
      }
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();
    }
  }

  // Modal de adição
  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  addComponente(form: NgForm) {
    if (form.valid) {
      const novoComponente: Componente = {
        codigo: this.gerarCodigo(),
        descricao: form.value.descricao,
        tipo: form.value.tipo,
        fabricante: form.value.fabricante,
        tamanho: form.value.tamanho,
        numeroSerie: form.value.numeroSerie
      };

      if (this.componentesFiltradas.some(c => c.numeroSerie === novoComponente.numeroSerie)) {
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
      } else {
        this.componentesFiltradas.push(novoComponente);
        const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
        addModal.hide();
      }
    } else {
      // Exibir mensagens de validação
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  // Modal de edição
  openEditModal(index: number) {
    this.editIndex = index;
    this.componenteParaEditar = { ...this.componentesFiltradas[index] };
    this.editTipoSelecionado = this.componenteParaEditar.tipo;
    this.editForm.patchValue(this.componenteParaEditar);
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  editComponente() {
    if (this.editForm.valid && this.componenteParaEditar !== null && this.editIndex !== null) {
      const formValues = this.editForm.value;
      const originalValues = this.componentesFiltradas[this.editIndex];

      if (JSON.stringify(formValues) === JSON.stringify(originalValues)) {
        const noChangesModal = new bootstrap.Modal(document.getElementById('noChangesModal'));
        noChangesModal.show();
      } else {
        this.componentesFiltradas[this.editIndex] = { ...this.componenteParaEditar, ...formValues };
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
        const editSuccessModal = new bootstrap.Modal(document.getElementById('editSuccessModal'));
        editSuccessModal.show();
      }
    } else {
      // Exibir mensagens de validação
      Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onEditTipoChange(event: any) {
    this.editTipoSelecionado = event.target.value;
  }



  // Funções para gerar codigo e tipo selecionado

  gerarCodigo(): string {
    return 'C' + (this.componentesFiltradas.length + 1).toString().padStart(4, '0');
  }

  onTipoChange(event: any) {
    this.tipoSelecionado = event.target.value;
  }

  // Botões para cancelar a ação
  cancelAdd(form: NgForm) {
    form.resetForm();
    const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    addModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }

  cancelDelete() {
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    deleteModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }

  cancelEdit() {
    this.editForm.reset();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }
}