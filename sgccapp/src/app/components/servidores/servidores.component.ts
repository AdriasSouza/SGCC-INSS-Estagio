import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Servidor } from '../../model/servidor.model'; // Importando o modelo Servidor
import { ServidorService } from '../../service/servidor.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { SetorService } from '../../service/setor.service'; // Importando o serviço SetorService
import { UserService } from '../../service/user.service'; // Importando o serviço UserService
import { Setor } from '../../model/setor.model'; // Importando o modelo Setor
import { User } from '../../model/user.model'; // Importando o modelo User

declare var bootstrap: any;

@Component({
  selector: 'app-servidores',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent], // Adicionando HttpClientModule
  templateUrl: './servidores.component.html',
  styleUrls: ['./servidores.component.scss']
})
export class ServidoresComponent implements IList<Servidor>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: ServidorService, // Adicionando o serviço ServidorService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
    private setorService: SetorService, // Adicionando o serviço SetorService
    private userService: UserService // Adicionando o serviço UserService
  ) {
    this.editForm = this.fb.group({
      id: [''],
      inscricao_institucional: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(7), Validators.maxLength(7)]],
      nome_completo: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      inscricao_institucional: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(7), Validators.maxLength(7)]],
      nome_completo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.get();
    this.loadSelectOptions();
    console.log('ServidoresComponent inicializado!');
  }

  registros: Servidor[] = [];
  termoBusca: string | undefined = '';
  filtroInscricao: string = '';
  filtroNome: string = '';
  filtroUsuario: string = '';
  filtroSetor: string = '';
  setores: Setor[] = [];
  usuarios: User[] = [];
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  servidorSelecionado: Servidor | null = null;
  initialFormValues: any;
  inscricaoExistente: boolean = false;
  successMessage: string = '';

  colunas: TheadOrdenacao = [
    { campo: 'inscricao_institucional', descricao: 'Inscrição Institucional' },
    { campo: 'nome_completo', descricao: 'Nome Completo' },
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
      next: (resposta: RespostaPaginada<Servidor>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar servidores:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): Servidor[] {
    return this.registros.filter(servidor => {
      return (!this.filtroInscricao || servidor.inscricao_institucional.includes(this.filtroInscricao)) &&
             (!this.filtroNome || servidor.nome_completo.includes(this.filtroNome));
    });
  }

  loadSelectOptions() {
    this.setorService.get().subscribe({
      next: (resposta: RespostaPaginada<Setor>) => {
        this.setores = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar setores:', err);
      }
    });

    this.userService.get().subscribe({
      next: (resposta: RespostaPaginada<User>) => {
        this.usuarios = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
      }
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão do servidor?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Servidor excluído com sucesso!"
          });
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.servidorSelecionado = this.registros.find(servidor => servidor.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.servidorSelecionado) {
      this.delete(this.servidorSelecionado.id);
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
    }
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid && !this.inscricaoExistente) {
      const novoServidor: Servidor = {
        ...this.addForm.value,
        setor: { id: this.addForm.value.setor },
        agencia: { id: this.addForm.value.agencia }
      };
      this.servico.save(novoServidor).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Servidor adicionado com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(servidor: Servidor) {
    this.servidorSelecionado = servidor;
    this.editForm.patchValue({
      id: servidor.id,
      inscricao_institucional: servidor.inscricao_institucional,
      nome_completo: servidor.nome_completo,
    });
    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.servidorSelecionado && this.editForm.valid && !this.inscricaoExistente) {
      const servidorAtualizado: Servidor = {
        ...this.servidorSelecionado,
        ...this.editForm.value,
        setor: { id: this.editForm.value.setor },
        agencia: { id: this.editForm.value.agencia }
      };
      this.servico.save(servidorAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Servidor editado com sucesso!"
          });
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  checkInscricaoInstitucional(formType: 'add' | 'edit') {
    const inscricao = formType === 'add' ? this.addForm.get('inscricao_institucional')?.value : this.editForm.get('inscricao_institucional')?.value;
    if (inscricao) {
      this.servico.checkInscricaoExists(inscricao).subscribe({
        next: (exists: boolean) => {
          this.inscricaoExistente = exists;
        },
        error: (err) => {
          console.error('Erro ao verificar inscrição institucional:', err);
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
}