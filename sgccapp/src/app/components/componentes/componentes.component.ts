import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Componente } from '../../model/componente.model'; // Importando o modelo Componente
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { TipoComponenteService } from '../../service/tipo-componente.service'; // Importando o serviço TipoComponenteService
import { TipoComponente } from '../../model/tipo-componente.model'; // Importando o modelo TipoComponente
import { ComponenteService } from '../../service/componete.service';

declare var bootstrap: any;

@Component({
  selector: 'app-componente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent, BarraComandosComponent], // Adicionando HttpClientModule
  templateUrl: './componentes.component.html',
  styleUrls: ['./componentes.component.scss']
})
export class ComponentesComponent implements IList<Componente>, OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: ComponenteService, // Adicionando o serviço ComponenteService como dependência
    private tipoComponenteService: TipoComponenteService, // Adicionando o serviço TipoComponenteService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
  ) {
    this.editForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      tipo: ['', Validators.required],
      fabricante: ['', Validators.required],
      tamanho_mem: [''],
      n_serie: [''],
      data_aquisicao: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      tipo: ['', Validators.required],
      fabricante: ['', Validators.required],
      tamanho_mem: [''],
      n_serie: [''],
      data_aquisicao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.get();
    this.loadTipoComponentes();
    console.log('ComponentesComponent inicializado!');
  }

  registros: Componente[] = [];
  tiposComponentes: TipoComponente[] = [];
  termoBusca: string | undefined = '';
  filtroCodigo: string = '';
  filtroNome: string = '';
  filtroDescricao: string = '';
  filtroFabricante: string = '';
  filtroTipo: string = '';
  filtroTamanhoMem: string = '';
  filtroNumeroSerie: string = '';
  filtroDataAquisicao: string = '';
  editForm: FormGroup;
  addForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  componenteSelecionado: Componente | null = null;
  mostrarTamanhoMem: boolean = false;
  initialFormValues: any;

  colunas: TheadOrdenacao = [
    { campo: 'codigo', descricao: 'Código' },
    { campo: 'nome', descricao: 'Nome' },
    { campo: 'descricao', descricao: 'Descrição' },
    { campo: 'tipo.nome', descricao: 'Tipo' },
    { campo: 'fabricante', descricao: 'Fabricante' },
    { campo: 'tamanho_mem', descricao: 'Tamanho Memória' },
    { campo: 'n_serie', descricao: 'Número de Série' },
    { campo: 'data_aquisicao', descricao: 'Data de Aquisição' },
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
      next: (resposta: RespostaPaginada<Componente>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err: any) => {
        console.error('Erro ao buscar componentes:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  loadTipoComponentes() {
    this.tipoComponenteService.get().subscribe({
      next: (resposta: RespostaPaginada<TipoComponente>) => {
        this.tiposComponentes = resposta.results;
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de componentes:', err);
      }
    });
  }

  registrosFiltrados(): Componente[] {
    return this.registros.filter(componente => {
      return (!this.filtroCodigo || componente.codigo.toString().includes(this.filtroCodigo)) &&
             (!this.filtroNome || componente.nome.includes(this.filtroNome)) &&
             (!this.filtroDescricao || componente.descricao.includes(this.filtroDescricao)) &&
             (!this.filtroFabricante || componente.fabricante.includes(this.filtroFabricante)) &&
             (!this.filtroTipo || componente.tipo?.nome.includes(this.filtroTipo)) &&
             (!this.filtroTamanhoMem || componente.tamanho_mem?.toString().includes(this.filtroTamanhoMem)) &&
             (!this.filtroNumeroSerie || componente.n_serie?.includes(this.filtroNumeroSerie)) &&
             (!this.filtroDataAquisicao || componente.data_aquisicao.toString().includes(this.filtroDataAquisicao));
    });
  }

  delete(id: number): void {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Componente excluído com sucesso!"
          });
        }
      });
  }

  openDeleteModal(id: number) {
    this.componenteSelecionado = this.registros.find(componente => componente.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.componenteSelecionado) {
      this.delete(this.componenteSelecionado.id);
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
    }
  }

  openAddModal() {
    this.mostrarTamanhoMem = false;
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid) {
      const novoComponente: Componente = {
        ...this.addForm.value,
        tipo: { id: this.addForm.value.tipo },
        tamanho_mem: this.mostrarTamanhoMem && this.addForm.value.tamanho_mem ? this.addForm.value.tamanho_mem : null // Define tamanho_mem como null se o campo estiver oculto ou vazio
      };
      this.servico.save(novoComponente).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Componente adicionado com sucesso!"
          });
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  openEditModal(componente: Componente) {
    this.componenteSelecionado = componente;
    this.mostrarTamanhoMem = componente.tipo?.nome?.includes('Memória') ?? false;
    this.editForm.patchValue({
      codigo: componente.codigo,
      nome: componente.nome,
      descricao: componente.descricao,
      tipo: componente.tipo?.id || '',
      fabricante: componente.fabricante,
      tamanho_mem: componente.tamanho_mem || '',
      n_serie: componente.n_serie || '',
      data_aquisicao: componente.data_aquisicao
    });
    this.initialFormValues = this.editForm.value;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.componenteSelecionado && this.editForm.valid && this.formChanged()) {
      const componenteAtualizado: Componente = {
        ...this.componenteSelecionado,
        ...this.editForm.value,
        tipo: { id: this.editForm.value.tipo },
        tamanho_mem: this.mostrarTamanhoMem && this.editForm.value.tamanho_mem ? this.editForm.value.tamanho_mem : null // Define tamanho_mem como null se o campo estiver oculto ou vazio
      };
      this.servico.save(componenteAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Componente editado com sucesso!"
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

  onTipoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tipoId = parseInt(selectElement.value, 10);
    const tipoSelecionado = this.tiposComponentes.find(tipo => tipo.id === tipoId);
    this.mostrarTamanhoMem = tipoSelecionado?.nome.includes('Memória') || false;
  }

  validateCodigo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 9) {
      inputElement.value = inputElement.value.slice(0, 9);
    }
  }
}