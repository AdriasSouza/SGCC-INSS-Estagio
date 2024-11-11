import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertaService } from '../../service/alerta.service';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent], // Adicionando HttpClientModule
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  registros: User[] = [];
  addForm: FormGroup;
  editForm: FormGroup;
  mostrarFiltros: boolean = false;
  usuarioSelecionado: User | null = null;
  initialFormValues: any;
  filtroNome: string = '';
  filtroEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: UserService,
    private servicoAlerta: AlertaService
  ) {
    this.addForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.editForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.get();
  }

  get() {
    this.servico.get().subscribe({
      next: (resposta: RespostaPaginada<User>) => {
        this.registros = resposta.results; // Assuming 'resultados' contains the array of users
        console.log('Usuários:', this.registros);
      },
      error: (err) => {
        console.error('Erro ao buscar usuários:', err);
      }
    });
  }

  registrosFiltrados(): User[] {
    return this.registros.filter(usuario => {
      return (!this.filtroNome || usuario.servidor?.nome_completo.includes(this.filtroNome)) &&
             (!this.filtroEmail || usuario.email.includes(this.filtroEmail));
    });
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid) {
      const novoUser: User = this.addForm.value;
      this.servico.save(novoUser).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Usuário adicionado com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(usuario: User) {
    this.usuarioSelecionado = usuario;
    this.editForm.patchValue({
      id: usuario.id,
      nome: usuario.servidor?.nome_completo,
      email: usuario.email
    });
    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.usuarioSelecionado && this.editForm.valid && this.formChanged()) {
      const usuarioAtualizado: User = {
        ...this.usuarioSelecionado,
        ...this.editForm.value
      };
      this.servico.save(usuarioAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Usuário editado com sucesso!"
          });
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  formChanged(): boolean {
    return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.editForm.value);
  }

  openDeleteModal(id: number) {
    this.usuarioSelecionado = this.registros.find(usuario => usuario.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.usuarioSelecionado) {
      this.servico.delete(this.usuarioSelecionado!.id!).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Usuário excluído com sucesso!"
          });
          const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          deleteModal.hide();
        }
      });
    }
  }
}