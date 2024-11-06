import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { TipoComponenteService } from '../../service/tipo-componente.service';
import { TipoComponente } from '../../model/tipo-componente.model';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { ETipoAlerta } from '../../model/e-tipo-alerta';


declare var bootstrap: any;

@Component({
  selector: 'app-tipo-componente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './tipo-componente.component.html',
  styleUrls: ['./tipo-componente.component.css']
})
export class TipoComponenteComponent implements IList<TipoComponente>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: TipoComponenteService, // Adicionando o serviço TipoComponenteService como dependência
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
    console.log('TipoComponenteComponent inicializado!');
  }

  registros: TipoComponente[] = [];
  termoBusca: string | undefined = '';
  filtroNome: string = '';
  filtroDescricao: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  tipoComponenteSelecionado: TipoComponente | null = null;

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
      next: (resposta: RespostaPaginada<TipoComponente>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar tipos de componentes:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): TipoComponente[] {
    return this.registros.filter(tipoComponente => {
      return (!this.filtroNome || tipoComponente.nome?.includes(this.filtroNome)) &&
             (!this.filtroDescricao || tipoComponente.descricao?.includes(this.filtroDescricao));
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão do tipo de componente?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Tipo de componente excluído com sucesso!"
          });
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.tipoComponenteSelecionado = this.registros.find(tipoComponente => tipoComponente.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.tipoComponenteSelecionado) {
      this.delete(this.tipoComponenteSelecionado.id);
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
      const novoTipoComponente: TipoComponente = {
        ...this.addForm.value
      };
      this.servico.save(novoTipoComponente).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Tipo de componente adicionado com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(tipoComponente: TipoComponente) {
    this.tipoComponenteSelecionado = tipoComponente;
    this.editForm.patchValue({
      id: tipoComponente.id,
      nome: tipoComponente.nome,
      descricao: tipoComponente.descricao
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.tipoComponenteSelecionado && this.editForm.valid) {
      const tipoComponenteAtualizado: TipoComponente = {
        ...this.tipoComponenteSelecionado,
        ...this.editForm.value
      };
      this.servico.save(tipoComponenteAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Tipo de componente editado com sucesso!"
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