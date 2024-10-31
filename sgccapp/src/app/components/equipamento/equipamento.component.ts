import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Observable } from 'rxjs';
import { Equipamento } from '../../model/equipamento.model'; // Importando o modelo Equipamento
import { Setor } from '../../model/setor.model'; // Importando o modelo Setor
import { Servidor } from '../../model/servidor.model'; // Importando o modelo Servidor
import { EquipamentoService } from '../../service/equipamento.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';

declare var bootstrap: any;

@Component({
  selector: 'app-equipamento',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.scss']
})
export class EquipamentoComponent implements IList<Equipamento>, OnInit {

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private servico: EquipamentoService, // Adicionando o serviço EquipamentoService como,
    private servicoAlerta: AlertaService // Adicionando o serviço AlertaService
  ) {
    this.editForm = this.fb.group({
      plaqueta: ['', Validators.required],
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      tipo: ['', Validators.required],
      setor: ['', Validators.required],
      responsavel: ['', Validators.required],
      sala: ['', Validators.required],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      data_aquisicao: ['', Validators.required]
    });

    this.manutencaoForm = this.fb.group({
      responsavel: ['', Validators.required],
      dataManutencao: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.get();
  }

  registros: Equipamento[] = [];
  termoBusca: string | undefined = '';
  editForm: FormGroup;
  manutencaoForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;

  colunas: TheadOrdenacao = [
    { campo: 'plaqueta', descricao: 'Data' },
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'marca', descricao: 'Marca' },
    { campo: 'tipo.nome', descricao: 'Tipo' },
    { campo: 'setor.nome', descricao: 'Setor' },
    { campo: 'servidor.nome_completo', descricao: 'Responsavel' },
    { campo: 'sala', descricao: 'Sala' },
    { campo: 'estado', descricao: 'Estado' },
    { campo: 'situacao', descricao: 'Situação' },
    { campo: 'data_aquisicao', descricao: 'Data' },
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

  get(termoBusca?: string): void {
    this.termoBusca = termoBusca;
    this.servico.get(termoBusca).subscribe({
      next: (resposta: Equipamento[]) => {
        this.registros = resposta;
      }
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão da especialidade?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Especialidade excluída com sucesso!"
          });
        }
      });
    }
  }

  openDeleteModal(id: number) {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }


  // confirmDelete() {
  //   if (this.equipamentoParaExcluir) {
  //     this.deleteEquipamento(this.equipamentoParaExcluir.id).subscribe(() => {
  //       this.loadEquipamentos();
  //       const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
  //       deleteModal.hide();
  //       const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  //       successModal.show();
  //     });
  //   }
  // }

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


  openManutencaoModal(equipamento: Equipamento) {
    const manutencaoModal = new bootstrap.Modal(document.getElementById('manutencaoModal'));
    manutencaoModal.show();
  }

  // registrarManutencao() {
  //   if (this.manutencaoForm.valid) {
  //     const manutencaoData = this.manutencaoForm.value;
  //     console.log('Registrar manutenção para o equipamento:', this.equipamentoParaManutencao, manutencaoData);
  //     const manutencaoModal = bootstrap.Modal.getInstance(document.getElementById('manutencaoModal'));
  //     manutencaoModal.hide();
  //   } else {
  //     Object.keys(this.manutencaoForm.controls).forEach(field => {
  //       const control = this.manutencaoForm.get(field);
  //       control?.markAsTouched({ onlySelf: true });
  //     });
  //   }
  // }

  // onEditTipoChange(event: any) {
  //   this.editTipoSelecionado = event.target.value;
  // }

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

  cancelManutencao() {
    const manutencaoModal = bootstrap.Modal.getInstance(document.getElementById('manutencaoModal'));
    manutencaoModal.hide();
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    cancelModal.show();
  }
}