import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Solicitacao } from '../../model/solicitacao.model'; // Importando o modelo Solicitacao
import { SolicitacaoService } from '../../service/solicitacao.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { Servidor } from '../../model/servidor.model'; // Importando o modelo Servidor
import { UserService } from '../../service/user.service';
import { User } from '../../model/user.model';

declare var bootstrap: any;

@Component({
  selector: 'app-solicitacao',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent implements IList<Solicitacao>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: SolicitacaoService, // Adicionando o serviço SolicitacaoService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
    private userService: UserService // Adicionando o serviço UserService como dependência
  ) {
    this.editForm = this.fb.group({
      status: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      user: ['', Validators.required],
      data: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.approveForm = this.fb.group({
      descricao: ['', Validators.required]
    });

    this.rejectForm = this.fb.group({
      descricao: ['', Validators.required]
    });

    this.forwardForm = this.fb.group({
      servidor: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUserData();
    console.log('SolicitacaoComponent inicializado!');
  }

  registros: Solicitacao[] = [];
  servidores: Servidor[] = []; // Lista de servidores para o dropdown
  termoBusca: string | undefined = '';
  filtroEmail: string = '';
  filtroDescricao: string = '';
  filtroStatus: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  approveForm: FormGroup;
  rejectForm: FormGroup;
  forwardForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  solicitacaoSelecionada: Solicitacao | null = null;
  isAdmin: boolean = false;
  isStaff: boolean = false;
  userId: number | null = null;

  colunas: TheadOrdenacao = [
    { campo: 'user.email', descricao: 'Solicitante' },
    { campo: 'data', descricao: 'Data' },
    { campo: 'status', descricao: 'Status' },
    { campo: 'descricao', descricao: 'Descrição' },
    { campo: '', descricao: 'Ações' },
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

  getUserData(): void {
    this.userService.getUserData().subscribe({
      next: (user: User) => {
        this.isAdmin = user.is_superuser || false;
        this.isStaff = user.is_staff || false;
        this.userId = user.id ?? null;
        this.get();
      },
      error: (err) => {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    });
  }

  get(termoBusca?: string): void {
    this.termoBusca = termoBusca;
    this.servico.get(termoBusca).subscribe({
      next: (resposta: RespostaPaginada<Solicitacao>) => {
        if (this.isAdmin) {
          this.registros = resposta.results; // Admin vê todas as solicitações
        } else if (this.isStaff) {
          this.registros = resposta.results.filter(solicitacao => solicitacao.user?.id === this.userId); // Staff vê apenas suas próprias solicitações
        }
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar solicitações:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): Solicitacao[] {
    return this.registros.filter(solicitacao => {
      return (!this.filtroEmail || solicitacao.user?.email.includes(this.filtroEmail)) &&
             (!this.filtroDescricao || solicitacao.descricao.includes(this.filtroDescricao)) &&
             (!this.filtroStatus || solicitacao.status === this.filtroStatus);
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão da solicitação?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Solicitação excluída com sucesso!"
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

  openEditModal(solicitacao: Solicitacao) {
    this.solicitacaoSelecionada = solicitacao;
    this.editForm.patchValue({
      status: solicitacao.status,
      descricao: solicitacao.descricao
    });
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

  openApproveModal(solicitacao: Solicitacao) {
    this.solicitacaoSelecionada = solicitacao;
    const approveModal = new bootstrap.Modal(document.getElementById('approveModal'));
    approveModal.show();
  }

  confirmApprove() {
    if (this.solicitacaoSelecionada) {
      this.solicitacaoSelecionada.descricao = this.approveForm.get('descricao')?.value;
      this.solicitacaoSelecionada.status = 'ATENDIDO';
      console.log('Aprovando solicitação:', this.solicitacaoSelecionada); // Adiciona log para depuração
      this.servico.save(this.solicitacaoSelecionada).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Solicitação aprovada com sucesso!"
          });
          const approveModal = bootstrap.Modal.getInstance(document.getElementById('approveModal'));
          approveModal.hide();
        },
        error: (err) => {
          console.error('Erro ao aprovar solicitação:', err); // Adiciona log para depuração
        }
      });
    }
  }

  openRejectModal(solicitacao: Solicitacao) {
    this.solicitacaoSelecionada = solicitacao;
    const rejectModal = new bootstrap.Modal(document.getElementById('rejectModal'));
    rejectModal.show();
  }

  confirmReject() {
    if (this.solicitacaoSelecionada) {
      this.solicitacaoSelecionada.descricao = this.rejectForm.get('descricao')?.value;
      this.solicitacaoSelecionada.status = 'NEGADO';
      console.log('Rejeitando solicitação:', this.solicitacaoSelecionada); // Adiciona log para depuração
      this.servico.save(this.solicitacaoSelecionada).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Solicitação rejeitada com sucesso!"
          });
          const rejectModal = bootstrap.Modal.getInstance(document.getElementById('rejectModal'));
          rejectModal.hide();
        },
        error: (err) => {
          console.error('Erro ao rejeitar solicitação:', err); // Adiciona log para depuração
        }
      });
    }
  }
  
  openForwardModal(solicitacao: Solicitacao) {
    this.solicitacaoSelecionada = solicitacao;
    const forwardModal = new bootstrap.Modal(document.getElementById('forwardModal'));
    forwardModal.show();
  }

  confirmForward() {
    if (this.solicitacaoSelecionada) {
      const servidorId = this.forwardForm.get('servidor')?.value;
      this.solicitacaoSelecionada.status = 'ENCAMINHADO';
      // Adicione a lógica para encaminhar a solicitação ao servidor selecionado
      console.log('Encaminhando solicitação:', this.solicitacaoSelecionada); // Adiciona log para depuração
      this.servico.save(this.solicitacaoSelecionada).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Solicitação encaminhada com sucesso!"
          });
          const forwardModal = bootstrap.Modal.getInstance(document.getElementById('forwardModal'));
          forwardModal.hide();
        },
        error: (err) => {
          console.error('Erro ao encaminhar solicitação:', err); // Adiciona log para depuração
        }
      });
    }
  }
  
  confirmEdit() {
    if (this.solicitacaoSelecionada) {
      this.solicitacaoSelecionada.status = this.editForm.get('status')?.value;
      this.solicitacaoSelecionada.descricao = this.editForm.get('descricao')?.value;
      console.log('Editando solicitação:', this.solicitacaoSelecionada); // Adiciona log para depuração
      this.servico.save(this.solicitacaoSelecionada).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Solicitação editada com sucesso!"
          });
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        },
        error: (err) => {
          console.error('Erro ao editar solicitação:', err); // Adiciona log para depuração
        }
      });
    }
  }
}