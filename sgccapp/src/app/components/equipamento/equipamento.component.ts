import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Equipamento } from '../../model/equipamento.model';
import { EquipamentoService } from '../../service/equipamento.service';
import { TipoEquipamentoService } from '../../service/tipo-equipamento.service';
import { SetorService } from '../../service/setor.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { TipoEquipamento } from '../../model/tipo-equipamento.model';
import { Setor } from '../../model/setor.model';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { Servidor } from '../../model/servidor.model';
import { ServidorService } from '../../service/servidor.service';
import { Componente } from '../../model/componente.model';
import { ComponenteService } from '../../service/componete.service';

declare var bootstrap: any;

@Component({
  selector: 'app-equipamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent],
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.scss']
})
export class EquipamentoComponent implements IList<Equipamento>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: EquipamentoService,
    private tipoEquipamentoService: TipoEquipamentoService,
    private setorService: SetorService,
    private servidorService: ServidorService,
    private componenteService: ComponenteService,
    private servicoAlerta: AlertaService
  ) {
    this.editForm = this.fb.group({
      id: [''],
      plaqueta: ['', Validators.required],
      nome: ['', Validators.required],
      marca: [''],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      sala: [''],
      setor: ['', Validators.required],
      tipo: ['', Validators.required],
      servidor_responsavel: ['', Validators.required],
      data_aquisicao: ['']
    });

    this.addForm = this.fb.group({
      plaqueta: ['', Validators.required],
      nome: ['', Validators.required],
      marca: [''],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      sala: [''],
      setor: ['', Validators.required],
      tipo: ['', Validators.required],
      servidor_responsavel: ['', Validators.required],
      data_aquisicao: ['']
    });
  }

  ngOnInit() {
    this.get();
    this.loadSelectOptions();
    console.log('EquipamentoComponent inicializado!');
  }

  registros: Equipamento[] = [];
  tiposEquipamento: TipoEquipamento[] = [];
  setores: Setor[] = [];
  servidores: Servidor[] = [];
  componentesDisponiveis: Componente[] = [];
  componentesAdicionados: Componente[] = [];
  termoBusca: string | undefined = '';
  filtroPlaqueta: string = '';
  filtroNome: string = '';
  filtroMarca: string = '';
  filtroEstado: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  equipamentoSelecionado: Equipamento | null = null;
  initialFormValues: any;
  successMessage: string = '';

  colunas: TheadOrdenacao = [
    { campo: 'plaqueta', descricao: 'Plaqueta' },
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'marca', descricao: 'Marca' },
    { campo: 'estado', descricao: 'Estado' },
    { campo: 'situacao', descricao: 'Situação' },
    { campo: 'setor.nome', descricao: 'Setor' },
    { campo: 'tipo.nome', descricao: 'Tipo' },
    { campo: '', descricao: 'Ações' }
  ]

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
      next: (resposta: RespostaPaginada<Equipamento>) => {
        this.registros = resposta.results;
        console.log('registros:', this.registros);
      },
      error: (err) => {
        console.error('Erro ao buscar equipamentos:', err);
      }
    });
  }

  validatePlaqueta(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 9) {
      inputElement.value = inputElement.value.slice(0, 9);
    }
  }

  registrosFiltrados(): Equipamento[] {
    return this.registros.filter(equipamento => {
      return (!this.filtroPlaqueta || equipamento.plaqueta?.includes(this.filtroPlaqueta)) &&
             (!this.filtroNome || equipamento.nome?.includes(this.filtroNome)) &&
             (!this.filtroMarca || equipamento.marca?.includes(this.filtroMarca)) &&
             (!this.filtroEstado || equipamento.estado.includes(this.filtroEstado));
    });
  }

  loadSelectOptions() {
    this.tipoEquipamentoService.get().subscribe({
      next: (resposta: RespostaPaginada<TipoEquipamento>) => {
        this.tiposEquipamento = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de equipamento:', err);
      }
    });

    this.setorService.get().subscribe({
      next: (resposta: RespostaPaginada<Setor>) => {
        this.setores = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar setores:', err);
      }
    });

    this.servidorService.get().subscribe({
      next: (resposta: RespostaPaginada<Servidor>) => {
        this.servidores = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar servidores:', err);
      }
    });

    this.componenteService.get().subscribe({
      next: (resposta: RespostaPaginada<Componente>) => {
        this.componentesDisponiveis = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar componentes:', err);
      }
    });
  }

  delete(id: number): void {
    if (confirm('Confirma a exclusão do equipamento?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento excluído com sucesso!"
          });
          this.showSuccessModal("Equipamento excluído com sucesso!");
        }
      });
    }
  }

  openDeleteModal(id: number) {
    this.equipamentoSelecionado = this.registros.find(equipamento => equipamento.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.equipamentoSelecionado) {
      this.delete(this.equipamentoSelecionado.id);
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
      const novoEquipamento: Equipamento = {
        ...this.addForm.value,
        tipo: { id: this.addForm.value.tipo },
        setor: { id: this.addForm.value.setor },
        servidor_responsavel: { id: this.addForm.value.servidor_responsavel },
        componentes: this.componentesAdicionados
      };
      this.servico.save(novoEquipamento).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento adicionado com sucesso!"
          });
          this.showSuccessModal("Equipamento adicionado com sucesso!");
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(equipamento: Equipamento) {
    this.equipamentoSelecionado = equipamento;
    this.editForm.patchValue({
      id: equipamento.id,
      plaqueta: equipamento.plaqueta,
      nome: equipamento.nome,
      marca: equipamento.marca,
      estado: equipamento.estado,
      situacao: equipamento.situacao,
      sala: equipamento.sala,
      setor: equipamento.setor?.id,
      tipo: equipamento.tipo?.id,
      servidor_responsavel: equipamento.servidor_responsavel?.id,
      data_aquisicao: equipamento.data_aquisicao
    });
    this.componentesAdicionados = equipamento.componentes || [];
    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.equipamentoSelecionado && this.editForm.valid) {
      const equipamentoAtualizado: Equipamento = {
        ...this.equipamentoSelecionado,
        ...this.editForm.value,
        setor: { id: this.editForm.value.setor },
        tipo: { id: this.editForm.value.tipo },
        servidor_responsavel: { id: this.editForm.value.servidor_responsavel },
        componentes: this.componentesAdicionados
      };
      this.servico.save(equipamentoAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento editado com sucesso!"
          });
          this.showSuccessModal("Equipamento editado com sucesso!");
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  formChanged(): boolean {
    return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.editForm.value);
  }

  cancelAdd() {
    this.addForm.reset();
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

  showSuccessModal(message: string) {
    this.successMessage = message;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }

  openComponentesModal(equipamento: Equipamento) {
    this.equipamentoSelecionado = equipamento;
    this.componentesAdicionados = equipamento.componentes || [];
    const componentModal = new bootstrap.Modal(document.getElementById('componentModal'));
    componentModal.show();
  }

  addComponente(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const componenteId = parseInt(selectElement.value, 10);
    const componenteSelecionado = this.componentesDisponiveis.find(componente => componente.id === componenteId);
    if (componenteSelecionado && !this.componentesAdicionados.includes(componenteSelecionado)) {
      this.componentesAdicionados.push(componenteSelecionado);
    }
  }

  removeComponente(componenteId: number) {
    this.componentesAdicionados = this.componentesAdicionados.filter(componente => componente.id !== componenteId);
  }

  confirmComponentChanges() {
    if (this.equipamentoSelecionado) {
      this.equipamentoSelecionado.componentes = this.componentesAdicionados;
      this.servico.save(this.equipamentoSelecionado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Componentes atualizados com sucesso!"
          });
          const componentModal = bootstrap.Modal.getInstance(document.getElementById('componentModal'));
          componentModal.hide();
        }
      });
    }
  }
}