import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Setor } from '../../model/setor.model'; // Importando o modelo Setor
import { SetorService } from '../../service/setor.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { ServidorService } from '../../service/servidor.service'; // Importando o serviço ServidorService
import { Servidor } from '../../model/servidor.model'; // Importando o modelo Servidor
import { AgenciaService } from '../../service/agencia.service'; // Importando o serviço AgenciaService
import { Agencia } from '../../model/agencia.model'; // Importando o modelo Agencia

declare var bootstrap: any;

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.scss']
})
export class SetoresComponent implements IList<Setor>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: SetorService, // Adicionando o serviço SetorService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
    private servidorService: ServidorService, // Adicionando o serviço ServidorService
    private agenciaService: AgenciaService // Adicionando o serviço AgenciaService
  ) {
    this.editForm = this.fb.group({
      id: [''],
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(8)]],
      nome: ['', Validators.required],
      agencia: ['', Validators.required],
      chefe: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(8)]],
      nome: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.get();
    this.loadSelectOptions();
    console.log('SetoresComponent inicializado!');
  }

  registros: Setor[] = [];
  servidores: Servidor[] = [];
  agencias: Agencia[] = [];
  termoBusca: string | undefined = '';
  filtroCodigo: string = '';
  filtroNome: string = '';
  filtroAgencia: string = '';
  filtroChefe: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  setorSelecionado: Setor | null = null;
  initialFormValues: any;
  nomeExistente: boolean = false;
  successMessage: string = '';
  servidoresDoSetor: Servidor[] = [];
  servidoresParaAdicionar: Servidor[] = [];

  colunas: TheadOrdenacao = [
    { campo: 'codigo', descricao: 'Código' },
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'agencia.nome', descricao: 'Agência' },
    { campo: 'chefe.nome_completo', descricao: 'Chefe' },
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
      next: (resposta: RespostaPaginada<Setor>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar setores:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): Setor[] {
    return this.registros.filter(setor => {
      return (!this.filtroCodigo || setor.codigo?.toString().includes(this.filtroCodigo)) &&
             (!this.filtroNome || setor.nome?.includes(this.filtroNome)) &&
             (!this.filtroAgencia || setor.agencia?.nome?.includes(this.filtroAgencia)) &&
             (!this.filtroChefe || setor.chefe?.nome_completo?.includes(this.filtroChefe));
    });
  }

  loadSelectOptions() {
    this.servidorService.get().subscribe({
      next: (resposta: RespostaPaginada<Servidor>) => {
        this.servidores = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar servidores:', err);
      }
    });

    this.agenciaService.get().subscribe({
      next: (resposta: RespostaPaginada<Agencia>) => {
        this.agencias = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar agências:', err);
      }
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão do setor?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Setor excluído com sucesso!"
          });
          this.showSuccessModal("Setor excluído com sucesso!");
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.setorSelecionado = this.registros.find(setor => setor.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.setorSelecionado) {
      this.delete(this.setorSelecionado.id);
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
    }
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid && !this.nomeExistente) {
      const novoSetor: Setor = {
        ...this.addForm.value
      };
      this.servico.save(novoSetor).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Setor adicionado com sucesso!"
          });
          this.showSuccessModal("Setor adicionado com sucesso!");
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(setor: Setor) {
    this.setorSelecionado = setor;
    this.editForm.patchValue({
      id: setor.id,
      codigo: setor.codigo,
      nome: setor.nome,
      agencia: setor.agencia?.id,
      chefe: setor.chefe?.id
    });
    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.setorSelecionado && this.editForm.valid && !this.nomeExistente) {
      const setorAtualizado: Setor = {
        ...this.setorSelecionado,
        ...this.editForm.value,
        agencia: { id: this.editForm.value.agencia },
        chefe: { id: this.editForm.value.chefe }
      };
      this.servico.save(setorAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Setor editado com sucesso!"
          });
          this.showSuccessModal("Setor editado com sucesso!");
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  formChanged(): boolean {
    return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.editForm.value);
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

  openServidoresModal(setor: Setor) {
    this.setorSelecionado = setor;
    this.servidoresDoSetor = setor.servidores ? [...setor.servidores] : []; // Clonar a lista de servidores para edição temporária
    this.servidoresParaAdicionar = [];
    const servidoresModal = new bootstrap.Modal(document.getElementById('servidoresModal'));
    servidoresModal.show();
  }

  addServidor(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const servidorId = parseInt(selectElement.value, 10);
    const servidor = this.servidores.find(s => s.id === servidorId);
    if (servidor && !this.servidoresDoSetor.some(s => s.id === servidorId)) {
      this.servidoresParaAdicionar.push(servidor);
      this.servidoresDoSetor.push(servidor);
    }
    selectElement.value = ''; // Resetar o valor do select
  }

  removeServidor(servidorId: number) {
    this.servidoresDoSetor = this.servidoresDoSetor.filter(s => s.id !== servidorId);
    this.servidoresParaAdicionar = this.servidoresParaAdicionar.filter(s => s.id !== servidorId);
  }

  confirmServidores() {
    if (this.setorSelecionado) {
      const setorAtualizado: Setor = {
        ...this.setorSelecionado,
        servidores: this.servidoresDoSetor
      };
      this.servico.save(setorAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Servidores atualizados com sucesso!"
          });
          const servidoresModal = bootstrap.Modal.getInstance(document.getElementById('servidoresModal'));
          servidoresModal.hide();
        }
      });
    }
  }

  showSuccessModal(message: string) {
    this.successMessage = message;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }
}