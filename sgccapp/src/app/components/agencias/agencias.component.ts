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
      codigo: ['', Validators.required],

    });

    this.addForm = this.fb.group({
      nome: ['', Validators.required],
      codigo: ['', Validators.required],
      // Considerar para uma atualização futura
      // endereco: ['', Validators.required],
      // telefone: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.get();
    console.log('AgenciasComponent inicializado!');
  }

  registros: Agencia[] = [];
  termoBusca: string | undefined = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;

  colunas: TheadOrdenacao = [
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'numero', descricao: 'Código' }
    // { campo: 'endereco', descricao: 'Endereço' },
    // { campo: 'telefone', descricao: 'Telefone' },
    // { campo: '', descricao: 'Ações' },
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
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  cancelAdd(form: NgForm) {
    form.reset();
    const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    addModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }

  openEditModal(index: number) {
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
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
}