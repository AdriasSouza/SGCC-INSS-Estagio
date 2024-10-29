import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

//interface para simular o comportamento do model
interface Equipamento {
  plaqueta: number;
  nome: string;
  marca: string;
  tipo: string;
  setor: string;
  estado: string;
  situacao: string;
  responsavel: string;
  sala: number;
  data: Date; // Adicionado para simular a data de aquisição
}

@Component({
  selector: 'app-equipamento',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.scss']
})

export class EquipamentoComponent {

  // Lista inicial de equipamentos (pode ser carregada via serviço em um cenário real)
  equipamentos: Equipamento[] = [
    { plaqueta: 371298, nome: 'Positivo Micro', marca: 'Positivo', tipo: 'Computador', setor: 'Gerência', estado: 'Bom', situacao: 'Estoque', responsavel: 'Rusemberg', sala: 101, data: new Date('2022-01-01') },
    { plaqueta: 371299, nome: 'Monitor LG', marca: 'LG', tipo: 'Monitor', setor: 'Logística', estado: 'Novo', situacao: 'Em uso', responsavel: 'Ana', sala: 102, data: new Date('2022-02-01') },
    { plaqueta: 371300, nome: 'Impressora HP', marca: 'HP', tipo: 'Impressora', setor: 'Financeiro', estado: 'Usado', situacao: 'Em uso', responsavel: 'Carlos', sala: 103, data: new Date('2022-03-01') },
    { plaqueta: 371301, nome: 'Scanner Epson', marca: 'Epson', tipo: 'Scanner', setor: 'RH', estado: 'Novo', situacao: 'Estoque', responsavel: 'Mariana', sala: 104, data: new Date('2022-04-01') },
    { plaqueta: 371302, nome: 'Notebook Dell', marca: 'Dell', tipo: 'Notebook', setor: 'TI', estado: 'Bom', situacao: 'Em uso', responsavel: 'João', sala: 105, data: new Date('2022-05-01') },
    { plaqueta: 371303, nome: 'Projetor Sony', marca: 'Sony', tipo: 'Projetor', setor: 'Marketing', estado: 'Novo', situacao: 'Estoque', responsavel: 'Fernanda', sala: 106, data: new Date('2022-06-01') }


  ];

  // Filtros
  busca: string = '';
  searchText: string = '';
  selectedMarca: string = '';
  selectedTipo: string = '';
  selectedSetor: string = '';
  selectedEstado: string = '';
  selectedSituacao: string = '';

  // Equipamentos filtrados
  equipamentosFiltrados: Equipamento[] = [];
  equipamentoParaExcluir: Equipamento | null = null;
  equipamentoParaEditar: Equipamento | null = null;
  equipamentoParaManutencao: Equipamento | null = null;
  tipoSelecionado: string = '';
  editTipoSelecionado: string = '';
  editIndex: number | null = null;
  editForm: FormGroup;
  manutencaoForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      plaqueta: ['', Validators.required],
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      tipo: ['', Validators.required],
      setor: ['', Validators.required],
      responsavel: ['', Validators.required],
      sala: ['', Validators.required],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      data: ['', Validators.required]
    });

    this.manutencaoForm = this.fb.group({
      responsavel: ['', Validators.required],
      dataManutencao: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.equipamentosFiltrados = this.equipamentos;
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  toggleDropdown(index: number) {
    // Alterna a visibilidade do dropdown para a linha clicada
    this.showDropdown[index] = !this.showDropdown[index];
  }

  // Função para filtrar a lista de equipamentos de acordo com os filtros aplicados
  filterEquipamentos() {
    this.loading = true;
    this.equipamentosFiltrados = this.equipamentos.filter(equipamento => {
      const matchesSearch = this.searchText === '' || equipamento.plaqueta.toString().includes(this.searchText) || equipamento.sala.toString().includes(this.searchText) || equipamento.responsavel.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesMarca = this.selectedMarca === '' || equipamento.marca === this.selectedMarca;
      const matchesTipo = this.selectedTipo === '' || equipamento.tipo === this.selectedTipo;
      const matchesSetor = this.selectedSetor === '' || equipamento.setor === this.selectedSetor;
      const matchesEstado = this.selectedEstado === '' || equipamento.estado === this.selectedEstado;
      const matchesSituacao = this.selectedSituacao === '' || equipamento.situacao === this.selectedSituacao;

      this.loading = false; // Finaliza o estado de carregamento
      return matchesSearch && matchesMarca && matchesTipo && matchesSetor && matchesEstado && matchesSituacao;
    });
  }

  openDeleteModal(equipamento: Equipamento) {
    this.equipamentoParaExcluir = equipamento;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.equipamentoParaExcluir) {
      const index = this.equipamentosFiltrados.indexOf(this.equipamentoParaExcluir);
      if (index > -1) {
        this.equipamentosFiltrados.splice(index, 1);
      }
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();
    }
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  addEquipamento(form: NgForm) {
    if (form.valid) {
      const novoEquipamento: Equipamento = {
        plaqueta: form.value.plaqueta,
        nome: form.value.nome,
        marca: form.value.marca,
        tipo: form.value.tipo,
        setor: form.value.setor,
        responsavel: form.value.responsavel,
        sala: form.value.sala,
        estado: form.value.estado,
        situacao: form.value.situacao,
        data: form.value.data
      };

      if (this.equipamentosFiltrados.some(e => e.plaqueta === novoEquipamento.plaqueta)) {
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
      } else {
        this.equipamentosFiltrados.push(novoEquipamento);
        const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
        addModal.hide();
      }
    } else {
      // Exibir mensagens de validação
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  gerarCodigo(): string {
    return 'C' + (this.equipamentosFiltrados.length + 1).toString().padStart(4, '0');
  }

  onTipoChange(event: any) {
    this.tipoSelecionado = event.target.value;
  }

  cancelAdd(form: NgForm) {
    form.reset();
    const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    addModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }

  openEditModal(index: number) {
    this.editIndex = index;
    this.equipamentoParaEditar = { ...this.equipamentosFiltrados[index] };
    this.editTipoSelecionado = this.equipamentoParaEditar.tipo;
    this.editForm.patchValue(this.equipamentoParaEditar);
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  editEquipamento() {
    if (this.editForm.valid && this.equipamentoParaEditar !== null && this.editIndex !== null) {
      this.equipamentosFiltrados[this.editIndex] = { ...this.equipamentoParaEditar, ...this.editForm.value };
      const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      editModal.hide();
      const editSuccessModal = new bootstrap.Modal(document.getElementById('editSuccessModal'));
      editSuccessModal.show();
    } else {
      // Exibir mensagens de validação
      Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  openManutencaoModal(equipamento: Equipamento) {
    this.equipamentoParaManutencao = equipamento;
    this.manutencaoForm.reset();
    const manutencaoModal = new bootstrap.Modal(document.getElementById('manutencaoModal'));
    manutencaoModal.show();
  }

  registrarManutencao() {
    if (this.manutencaoForm.valid) {
      const manutencaoData = this.manutencaoForm.value;
      console.log('Registrar manutenção para o equipamento:', this.equipamentoParaManutencao, manutencaoData);
      const manutencaoModal = bootstrap.Modal.getInstance(document.getElementById('manutencaoModal'));
      manutencaoModal.hide();
    } else {
      // Exibir mensagens de validação
      Object.keys(this.manutencaoForm.controls).forEach(field => {
        const control = this.manutencaoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onEditTipoChange(event: any) {
    this.editTipoSelecionado = event.target.value;
  }

  cancelEdit() {
    this.editForm.reset();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }

  cancelDelete() {
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    deleteModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }

  cancelManutencao() {
    const manutencaoModal = bootstrap.Modal.getInstance(document.getElementById('manutencaoModal'));
    manutencaoModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }


}
