import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { ManutencaoService } from '../../service/manutencao.service';
import { EquipamentoService } from '../../service/equipamento.service';
import { ServidorService } from '../../service/servidor.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { Equipamento } from '../../model/equipamento.model';
import { Servidor } from '../../model/servidor.model';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { Manutencao } from '../../model/manutencao.model';
import { ETipoAlerta } from '../../model/e-tipo-alerta';

declare var bootstrap: any;

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent], // Adicionando HttpClientModule
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css']
})
export class ManutencaoComponent implements IList<Manutencao>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: ManutencaoService, // Adicionando o serviço ManutencaoService como dependência
    private equipamentoService: EquipamentoService, // Adicionando o serviço EquipamentoService
    private servidorService: ServidorService, // Adicionando o serviço ServidorService
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
  ) {
    this.editForm = this.fb.group({
      descricao: ['', Validators.required],
      data: ['', [Validators.required, this.dataValidator]],
      equipamento: ['', Validators.required],
      responsavel: ['', Validators.required],
    });

    this.addForm = this.fb.group({
      descricao: ['', Validators.required],
      data: ['', [Validators.required, this.dataValidator]],
      equipamento: ['', Validators.required],
      responsavel: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.get();
    this.loadSelectOptions();
    console.log('ManutencaoComponent inicializado!');
  }

  registros: Manutencao[] = [];
  termoBusca: string | undefined = '';
  filtroCodigo: string = '';
  filtroDescricao: string = '';
  filtroData: string = '';
  filtroEquipamento: string = '';
  filtroResponsavel: string = '';
  equipamentos: Equipamento[] = [];
  responsaveis: Servidor[] = [];
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  manutencaoSelecionada: Manutencao | null = null;
  initialFormValues: any;
  hoje: string = new Date().toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD

  colunas: TheadOrdenacao = [
    { campo: 'codigo', descricao: 'Código' },
    { campo: 'descricao', descricao: 'Descrição' },
    { campo: 'data', descricao: 'Data' },
    { campo: 'equipamento.nome', descricao: 'Equipamento' },
    { campo: 'responsavel.nome_completo', descricao: 'Responsável' },
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
             (!this.filtroDescricao || manutencao.descricao?.includes(this.filtroDescricao)) &&
             (!this.filtroData || (manutencao.data && manutencao.data.toString().includes(this.filtroData))) &&
             (!this.filtroEquipamento || (manutencao.equipamento && manutencao.equipamento.nome && manutencao.equipamento.nome.includes(this.filtroEquipamento))) &&
             (!this.filtroResponsavel || (manutencao.responsavel && manutencao.responsavel.nome_completo && manutencao.responsavel.nome_completo.includes(this.filtroResponsavel)));
    });
  }

  loadSelectOptions() {
    this.equipamentoService.get().subscribe({
      next: (resposta: RespostaPaginada<Equipamento>) => {
        this.equipamentos = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar equipamentos:', err);
      }
    });

    this.servidorService.get().subscribe({
      next: (resposta: RespostaPaginada<Servidor>) => {
        this.responsaveis = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar responsáveis:', err);
      }
    });
  }

  delete(id: number): void {
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
      const novaManutencao: Manutencao = {
        ...this.addForm.value,
        equipamento: { id: this.addForm.value.equipamento },
        responsavel: { id: this.addForm.value.responsavel }
      };
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
      id: manutencao.id,
      codigo: manutencao.codigo,
      descricao: manutencao.descricao,
      data: manutencao.data,
      equipamento: manutencao.equipamento?.id,
      responsavel: manutencao.responsavel?.id
    });
    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.manutencaoSelecionada && this.editForm.valid && this.formChanged()) {
      const manutencaoAtualizada: Manutencao = {
        ...this.manutencaoSelecionada,
        ...this.editForm.value,
        equipamento: { id: this.editForm.value.equipamento },
        responsavel: { id: this.editForm.value.responsavel }
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

  dataValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const data = control.value;
    if (data && new Date(data) > new Date()) {
      return { 'max': true };
    }
    return null;
  }
}