import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { TipoEquipamentoService } from '../../service/tipo-equipamento.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { TipoEquipamento } from '../../model/tipo-equipamento.model';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { ETipoAlerta } from '../../model/e-tipo-alerta';

declare var bootstrap: any;

@Component({
  selector: 'app-tipo-equipamento',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './tipo-equipamento.component.html',
  styleUrls: ['./tipo-equipamento.component.css']
})
export class TipoEquipamentoComponent implements IList<TipoEquipamento>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: TipoEquipamentoService, // Adicionando o serviço TipoEquipamentoService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
  ) {
    this.editForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
    });

    this.addForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.get();
    console.log('TipoEquipamentoComponent inicializado!');
  }

  registros: TipoEquipamento[] = [];
  termoBusca: string | undefined = '';
  filtroNome: string = '';
  filtroDescricao: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  tipoEquipamentoSelecionado: TipoEquipamento | null = null;

  colunas: TheadOrdenacao = [
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'descricao', descricao: 'Descrição' },
    { campo: '', descricao: 'Ações' }
  ]

  //Função para esconder e mostrar os filtros
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  toggleDropdown(index: number) {
    this.showDropdown[index] = !this.showDropdown[index];
  }

  ordenar(ordenacao: string[]): void {
    this.get(this.termoBusca);
  }

  get(termoBusca?: string): void {
    this.termoBusca = termoBusca;
    this.servico.get(termoBusca).subscribe({
      next: (resposta: RespostaPaginada<TipoEquipamento>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar tipos de equipamentos:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): TipoEquipamento[] {
    return this.registros.filter(tipoEquipamento => {
      return (!this.filtroNome || tipoEquipamento.nome?.includes(this.filtroNome)) &&
             (!this.filtroDescricao || tipoEquipamento.descricao?.includes(this.filtroDescricao));
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão do tipo de equipamento?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Tipo de equipamento excluído com sucesso!"
          });
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.tipoEquipamentoSelecionado = this.registros.find(tipoEquipamento => tipoEquipamento.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.tipoEquipamentoSelecionado) {
      this.delete(this.tipoEquipamentoSelecionado.id);
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
    }
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid) {
      const novoTipoEquipamento: TipoEquipamento = {
        ...this.addForm.value
      };
      this.servico.save(novoTipoEquipamento).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Tipo de equipamento adicionado com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(tipoEquipamento: TipoEquipamento) {
    this.tipoEquipamentoSelecionado = tipoEquipamento;
    this.editForm.patchValue({
      id: tipoEquipamento.id,
      nome: tipoEquipamento.nome,
      descricao: tipoEquipamento.descricao
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.tipoEquipamentoSelecionado && this.editForm.valid) {
      const tipoEquipamentoAtualizado: TipoEquipamento = {
        ...this.tipoEquipamentoSelecionado,
        ...this.editForm.value
      };
      this.servico.save(tipoEquipamentoAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Tipo de equipamento editado com sucesso!"
          });
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  cancelAdd(form: NgForm) {
    form.reset();
    const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    addModal.hide();
  }

  cancelEdit() {
    this.editForm.reset();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
  }

  cancelDelete() {
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    deleteModal.hide();
  }
}