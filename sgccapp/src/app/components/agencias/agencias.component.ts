import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Agencia } from '../../model/agencia.model'; // Importando o modelo Agencia
import { AgenciaService } from '../../service/agencia.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { RespostaPaginada } from '../../model/resposta-paginada';

declare var bootstrap: any;

@Component({
  selector: 'app-agencias',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './agencias.component.html',
  styleUrls: ['./agencias.component.css']
})
export class AgenciasComponent implements IList<Agencia>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: AgenciaService, // Adicionando o serviço AgenciaService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
  ) {
    this.editForm = this.fb.group({
      nome: ['', Validators.required],
      numero: ['', Validators.required],
    });

    this.addForm = this.fb.group({
      nome: ['', Validators.required],
      numero: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.get();
    console.log('AgenciasComponent inicializado!');
  }

  registros: Agencia[] = [];
  termoBusca: string | undefined = '';
  filtroNome: string = '';
  filtroNumero: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  agenciaSelecionada: Agencia | null = null;

  colunas: TheadOrdenacao = [
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'numero', descricao: 'Número' },
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
      next: (resposta: RespostaPaginada<Agencia>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar agências:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): Agencia[] {
    return this.registros.filter(agencia => {
      return (!this.filtroNome || (agencia.nome ?? '').includes(this.filtroNome)) &&
             (!this.filtroNumero || (agencia.numero?.toString() ?? '').includes(this.filtroNumero));
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão da agência?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Agência excluída com sucesso!"
          });
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.agenciaSelecionada = this.registros.find(agencia => agencia.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.agenciaSelecionada) {
      this.delete(this.agenciaSelecionada.id);
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
      const novaAgencia: Agencia = this.addForm.value;
      this.servico.save(novaAgencia).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Agência adicionada com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(agencia: Agencia) {
    this.agenciaSelecionada = agencia;
    this.editForm.patchValue({
      nome: agencia.nome,
      numero: agencia.numero
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.agenciaSelecionada && this.editForm.valid) {
      const agenciaAtualizada: Agencia = {
        ...this.agenciaSelecionada,
        ...this.editForm.value
      };
      this.servico.save(agenciaAtualizada).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Agência editada com sucesso!"
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