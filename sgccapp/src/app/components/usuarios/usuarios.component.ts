import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertaService } from '../../service/alerta.service';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { Servidor } from '../../model/servidor.model';
import { ServidorService } from './../../service/servidor.service';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  registros: User[] = [];
  servidores: Servidor[] = [];
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
    private servicoAlerta: AlertaService,
    private servicoServidor: ServidorService
  ) {
    // Formulário de Adicionar
    this.addForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      novaSenha: [''],
      confirmarSenha: [''],
      tipoUsuario: ['comum', Validators.required],
      servidor: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Formulário de Editar
    this.editForm = this.fb.group({
      id: [''],
      email: ['', [Validators.email]],
      novaSenha: [''],
      confirmarSenha: [''],
      tipoUsuario: ['comum'],
      servidor: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.get();
    this.getServidores();
  }

  nTipoUsuarioChange(event: any) {
    const tipoUsuario = event.target.value;
    const permissions = this.getPermissions(tipoUsuario);
    this.editForm.patchValue({
      is_staff: permissions.is_staff,
      is_superuser: permissions.is_superuser
    });
  }

  // Função para determinar is_staff e is_superuser com base no tipo de usuário
  getPermissions(tipoUsuario: string) {
    if (tipoUsuario === 'comum') {
      return { is_staff: false, is_superuser: false };
    } else if (tipoUsuario === 'admin') {
      return { is_staff: true, is_superuser: false };
    } else if (tipoUsuario === 'superuser') {
      return { is_staff: true, is_superuser: true };
    } else {
      return { is_staff: false, is_superuser: false }; // valor padrão ou adequado
    }
  }

  get() {
    this.servico.get().subscribe({
      next: (resposta: RespostaPaginada<User>) => {
        this.registros = resposta.results;
        console.log('Usuários:', this.registros);
      },
      error: (err) => {
        console.error('Erro ao buscar usuários:', err);
      }
    });
  }

  getServidores() {
    this.servicoServidor.get().subscribe({
      next: (resposta: RespostaPaginada<Servidor>) => {
        this.servidores = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao buscar servidores:', err);
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
    this.addForm.reset();
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid) {
      const novoUser: User = this.addForm.value;

      // Definir tipoUsuario padrão se for null ou undefined
      const tipoUsuario = novoUser.tipoUsuario || 'comum';
      const permissions = this.getPermissions(tipoUsuario); // Agora 'tipoUsuario' é uma string garantida

      // Definir permissões no novo usuário
      novoUser.is_staff = permissions.is_staff;
      novoUser.is_superuser = permissions.is_superuser;

      // Atribuir nova senha ao campo 'password' e remover 'novaSenha' e 'confirmaSenha'
      if (novoUser.novaSenha) {
        novoUser.password = novoUser.novaSenha;
        delete novoUser.novaSenha; // Remove o campo novaSenha
        delete novoUser.confirmaSenha; // Remove o campo confirmaSenha
      }

      // Verificar a estrutura do objeto
      console.log("Objeto a ser enviado:", novoUser);

      // Enviar o novo usuário
      this.servico.save(novoUser).subscribe({
        next: (response) => {
          this.get();  // Recarregar a lista de usuários
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Usuário adicionado com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        },
        error: (err) => {
          console.error("Erro ao adicionar usuário:", err);
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.ERRO,
            mensagem: "Erro ao adicionar o usuário. Tente novamente."
          });
        }
      });
    }
  }


  openEditModal(usuario: User) {
    this.usuarioSelecionado = usuario;

    // Determinando tipoUsuario a partir de is_staff e is_superuser
    let tipoUsuario = '';
    if (usuario.is_staff && usuario.is_superuser) {
      tipoUsuario = 'superuser';
    } else if (usuario.is_staff) {
      tipoUsuario = 'admin';
    } else {
      tipoUsuario = 'comum';
    }

    this.editForm.patchValue({
      id: usuario.id,
      nome: usuario.servidor?.nome_completo || '',
      email: usuario.email || '',
      tipoUsuario: tipoUsuario || '',  // Preenche o tipo de usuário com base em is_staff e is_superuser
      servidor: usuario.servidor || '' // Preencher o campo servidor no formulário
    });

    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.usuarioSelecionado && this.editForm.valid && this.formChanged()) {
      const { email, novaSenha, is_superuser, is_staff, servidor } = this.editForm.value;
      const usuarioAtualizado: User = {
        ...this.usuarioSelecionado,
        email,
        // Envia a nova senha apenas se for preenchida
        password: novaSenha || this.usuarioSelecionado.password,  // Se não houver nova senha, mantém a original
        is_superuser,
        is_staff,
        servidor // Atualizando o servidor
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

  // Validação para assegurar que a senha e a confirmação coincidam
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const form = control.parent;
    if (form && control.value !== form.get('novaSenha')?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
