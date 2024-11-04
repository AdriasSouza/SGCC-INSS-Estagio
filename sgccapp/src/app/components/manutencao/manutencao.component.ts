import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Manutencao } from '../../model/manutencao.model'; // Importando o modelo Manutencao
import { ManutencaoService } from '../../service/manutencao.service';
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
  selector: 'app-manutencao',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.scss']
})
export class ManutencaoComponent implements IList<Manutencao>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: ManutencaoService, // Adicionando o serviço ManutencaoService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
  ) {
    this.editForm = this.fb.group({
      codigo: ['', Validators.required],
      equipamento: ['', Validators.required],
      responsavel: ['', Validators.required],
      data: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      codigo: ['', Validators.required],
      equipamento: ['', Validators.required],
      responsavel: ['', Validators.required],
      data: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.get();
    console.log('ManutencaoComponent inicializado!');
  }

  registros: Manutencao[] = [];
  termoBusca: string | undefined = '';
  filtroCodigo: string = '';
  filtroEquipamento: string = '';
  filtroResponsavel: string = '';
  filtroDescricao: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  manutencaoSelecionada: Manutencao | null = null;

  colunas: TheadOrdenacao = [
    { campo: 'codigo', descricao: 'Código' },
    { campo: 'equipamento.nome', descricao: 'Equipamento' },
    { campo: 'responsavel.nome_completo', descricao: 'Responsável' },
    { campo: 'data', descricao: 'Data' },
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

  get(termoBusca?: string): void {
    this.termoBusca = termoBusca;
    this.servico.get(termoBusca).subscribe({
      next: (resposta: RespostaPaginada<Manutencao>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar manutenções:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  registrosFiltrados(): Manutencao[] {
    return this.registros.filter(manutencao => {
      return (!this.filtroCodigo || manutencao.codigo?.toString().includes(this.filtroCodigo)) &&
             (!this.filtroEquipamento || manutencao.equipamento?.nome?.includes(this.filtroEquipamento)) &&
             (!this.filtroResponsavel || manutencao.responsavel?.nome_completo?.includes(this.filtroResponsavel)) &&
             (!this.filtroDescricao || manutencao.descricao?.includes(this.filtroDescricao));
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão da manutenção?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Manutenção excluída com sucesso!"
          });
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.manutencaoSelecionada = this.registros.find(manutencao => manutencao.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.manutencaoSelecionada) {
      this.delete(this.manutencaoSelecionada.id);
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
      const novaManutencao: Manutencao = this.addForm.value;
      this.servico.save(novaManutencao).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Manutenção adicionada com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(manutencao: Manutencao) {
    this.manutencaoSelecionada = manutencao;
    this.editForm.patchValue({
      codigo: manutencao.codigo,
      equipamento: manutencao.equipamento?.id,
      responsavel: manutencao.responsavel?.id,
      data: manutencao.data,
      descricao: manutencao.descricao
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.manutencaoSelecionada && this.editForm.valid) {
      const manutencaoAtualizada: Manutencao = {
        ...this.manutencaoSelecionada,
        ...this.editForm.value
      };
      this.servico.save(manutencaoAtualizada).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Manutenção editada com sucesso!"
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