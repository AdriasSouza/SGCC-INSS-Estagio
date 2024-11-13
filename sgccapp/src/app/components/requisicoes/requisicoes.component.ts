// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
// import { SolicitacaoService } from '../../service/solicitacao.service';
// import { AlertaService } from '../../service/alerta.service';
// import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// import { ETipoAlerta } from '../../model/e-tipo-alerta';
// import { Solicitacao } from '../../model/solicitacao.model';
// import { RespostaPaginada } from '../../model/resposta-paginada';
// import { User } from '../../model/user.model';
// import { UserService } from '../../service/user.service';

// declare var bootstrap: any;

// @Component({
//   selector: 'app-requisicoes',
//   standalone: true,
//   imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule], // Adicionando HttpClientModule
//   templateUrl: './requisicoes.component.html',
//   styleUrls: ['./requisicoes.component.css']
// })
// export class RequisicoesComponent implements OnInit {

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private servico: SolicitacaoService, // Adicionando o serviço SolicitacaoService como dependência
//     private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
//     private userService: UserService, // Adicionando o serviço UserService como dependência
//   ) {
//     this.addForm = this.fb.group({
//       descricao: ['', Validators.required],
//       justificativa: ['', Validators.required]
//     });

//     this.editForm = this.fb.group({
//       descricao: ['', Validators.required],
//       justificativa: ['', Validators.required]
//     });
//   }

//   ngOnInit() {
//     this.getUserData();
//     console.log('RequisicoesComponent inicializado!');
//   }

//   requisicoes: Solicitacao[] = [];
//   addForm: FormGroup;
//   editForm: FormGroup;
//   loading: boolean = false;
//   userId: number | null = null;
//   solicitacaoSelecionada: Solicitacao | null = null;

//   getUserData(): void {
//     this.userService.getUserData().subscribe({
//       next: (user: User) => {
//         this.userId = user.id ?? null;
//         this.getRequisicoes();
//       },
//       error: (err) => {
//         console.error('Erro ao buscar dados do usuário:', err);
//       }
//     });
//   }

//   getRequisicoes(): void {
//     this.loading = true;
//     this.servico.get().subscribe({
//       next: (resposta: RespostaPaginada<Solicitacao>) => {
//         this.requisicoes = resposta.results.filter(solicitacao => solicitacao.user?.id === this.userId); // Filtra as requisições pelo ID do usuário logado
//         console.log('requisicoes:', this.requisicoes); // Adiciona o console.log para ver as requisições
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Erro ao buscar requisições:', err); // Você pode querer lidar com erros aqui
//         this.loading = false;
//       }
//     });
//   }

//   openAddModal() {
//     const addModal = new bootstrap.Modal(document.getElementById('addModal'));
//     addModal.show();
//   }

//   openEditModal(solicitacao: Solicitacao) {
//     this.solicitacaoSelecionada = solicitacao;
//     this.editForm.patchValue({
//       descricao: solicitacao.descricao,
//       justificativa: solicitacao.justificativa
//     });
//     const editModal = new bootstrap.Modal(document.getElementById('editModal'));
//     editModal.show();
//   }

//   confirmAdd() {
//     if (this.addForm.valid) {
//       const novaSolicitacao: Solicitacao = {
//         ...this.addForm.value,
//         data: new Date().toISOString(),
//         status: 'ANALISE',
//         user: { id: this.userId } // Passando o objeto usuário
//       };
//       this.userService.getUserData().subscribe({
//         next: (user: User) => {
//           novaSolicitacao.user = user; // Atribuindo o objeto usuário completo
//           this.servico.save(novaSolicitacao).subscribe({
//             complete: () => {
//               this.getRequisicoes();
//               this.servicoAlerta.enviarAlerta({
//                 tipo: ETipoAlerta.SUCESSO,
//                 mensagem: "Requisição enviada com sucesso!"
//               });
//               const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
//               addModal.hide();
//             }
//           });
//         },
//         error: (err) => {
//           console.error('Erro ao buscar dados do usuário:', err);
//         }
//       });
//     }
//   }

//   confirmEdit() {
//     if (this.editForm.valid && this.solicitacaoSelecionada) {
//       const solicitacaoAtualizada: Solicitacao = {
//         ...this.solicitacaoSelecionada,
//         ...this.editForm.value,
//         data: this.solicitacaoSelecionada.data,
//         status: this.solicitacaoSelecionada.status,
//         user: this.solicitacaoSelecionada.user
//       };
//       this.servico.save(solicitacaoAtualizada).subscribe({
//         complete: () => {
//           this.getRequisicoes();
//           this.servicoAlerta.enviarAlerta({
//             tipo: ETipoAlerta.SUCESSO,
//             mensagem: "Requisição editada com sucesso!"
//           });
//           const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
//           editModal.hide();
//         }
//       });
//     }
//   }
// }