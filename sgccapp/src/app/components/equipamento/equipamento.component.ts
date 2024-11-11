import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { Equipamento } from '../../model/equipamento.model'; // Importando o modelo Equipamento
import { EquipamentoService } from '../../service/equipamento.service';
import { AlertaService } from '../../service/alerta.service';
import { IList } from '../i-list';
import { TheadOrdenacao } from '../thead-ordenacao/thead-ordenacao';
import { ETipoAlerta } from '../../model/e-tipo-alerta';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TheadOrdenacaoComponent } from '../thead-ordenacao/thead-ordenacao.component';
import { BarraComandosComponent } from '../barra-comandos/barra-comandos.component';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { SetorService } from '../../service/setor.service'; // Importando o serviço SetorService
import { TipoEquipamentoService } from '../../service/tipo-equipamento.service'; // Importando o serviço TipoEquipamentoService
import { ServidorService } from '../../service/servidor.service'; // Importando o serviço ServidorService
import { Servidor } from '../../model/servidor.model'; // Importando o modelo Servidor
import { ComponenteService } from '../../service/componete.service';
import { Componente } from '../../model/componente.model';
import { TipoEquipamento } from '../../model/tipo-equipamento.model';
import { Setor } from '../../model/setor.model';

declare var bootstrap: any;

@Component({
  selector: 'app-equipamento',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule, TheadOrdenacaoComponent], // Adicionando HttpClientModule
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.scss']
})
export class EquipamentoComponent implements IList<Equipamento>, OnInit {

  registros: Equipamento[] = [];
  tipoEquipamento: TipoEquipamento[] = [];
  setores: Setor[] = [];
  servidores: Servidor[] = [];
  componentesDisponiveis: Componente[] = [];
  componentesAdicionados: Componente[] = [];
  termoBusca: string | undefined = '';
  filtroMarca: string = '';
  filtroTipo: string = '';
  filtroSetor: string = '';
  filtroEstado: string = '';
  filtroSituacao: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  marcas: string[] = [];
  estados: string[] = ['DEFASADO', 'ATENÇÃO', 'BOM', 'NOVO'];
  situacoes: string[] = ['EM_USO', 'RESERVA', 'MANUTENCAO', 'BAIXA', 'ALIENACAO', 'PERDIDO', 'ROUBADO'];
  editForm: FormGroup;
  addForm: FormGroup;
  componentForm: FormGroup;
  mostrarFiltros: boolean = false;
  showDropdown: boolean[] = [];
  loading: boolean = false;
  equipamentoSelecionado: Equipamento | null = null;
  initialFormValues: any;

  colunas: TheadOrdenacao = [
    { campo: 'plaqueta', descricao: 'Plaqueta' },
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private servico: EquipamentoService, // Adicionando o serviço EquipamentoService como dependência
    private servicoAlerta: AlertaService, // Adicionando o serviço AlertaService
    private setorService: SetorService, // Adicionando o serviço SetorService
    private tipoEquipamentoService: TipoEquipamentoService, // Adicionando o serviço TipoEquipamentoService
    private servidorService: ServidorService, // Adicionando o serviço ServidorService
    private componenteService: ComponenteService // Adicionando o serviço ComponenteService
  ) {
    this.editForm = this.fb.group({
      id: [''],
      plaqueta: ['', Validators.required],
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      tipo: ['', Validators.required],
      setor: ['', Validators.required],
      servidor: ['', Validators.required],
      sala: ['', Validators.required],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      data_aquisicao: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      plaqueta: ['', Validators.required],
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      data_aquisicao: ['', Validators.required]
    });

    this.componentForm = this.fb.group({
      componente: ['']
    });
  }

  ngOnInit() {
    this.get();
    this.loadFilterOptions();
    // this.loadSelectOptions();
    this.loadSetores();
    this.loadTiposEquipamentos();
    this.loadComponentesDisponiveis();
    console.log('EquipamentoComponent inicializado!');
  }

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
      next: (resposta: RespostaPaginada<Equipamento>) => {
        this.registros = resposta.results; // Extrai os registros da resposta paginada
        console.log('registros:', this.registros); // Adiciona o console.log para ver os registros
      },
      error: (err) => {
        console.error('Erro ao buscar equipamentos:', err); // Você pode querer lidar com erros aqui
      }
    });
  }

  formChanged(): boolean {
    return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.editForm.value);
  }

  registrosFiltrados(): Equipamento[] {
    return this.registros.filter(equipamento => {
      return (!this.filtroMarca || equipamento.marca?.includes(this.filtroMarca)) &&
             (!this.filtroTipo || equipamento.tipo?.nome?.includes(this.filtroTipo)) &&
             (!this.filtroSetor || equipamento.setor?.nome?.includes(this.filtroSetor)) &&
             (!this.filtroEstado || equipamento.estado.includes(this.filtroEstado)) &&
             (!this.filtroSituacao || equipamento.situacao.includes(this.filtroSituacao)) &&
             (!this.filtroDataInicio || new Date(equipamento.data_aquisicao!) >= new Date(this.filtroDataInicio)) &&
             (!this.filtroDataFim || new Date(equipamento.data_aquisicao!) <= new Date(this.filtroDataFim));
    });
  } 

  loadFilterOptions() {
    this.servico.get().subscribe({
      next: (resposta: RespostaPaginada<Equipamento>) => {
        const equipamentos = resposta.results;
        this.marcas = [...new Set(equipamentos.map(e => e.marca).filter((marca): marca is string => !!marca))];
        this.tipoEquipamento = [...new Set(equipamentos.map(e => e.tipo).filter((tipo): tipo is TipoEquipamento => !!tipo))];
        this.setores = [...new Set(equipamentos.map(e => e.setor).filter((setor): setor is Setor => !!setor))];
      },
      error: (err) => {
        console.error('Erro ao carregar opções de filtro:', err);
      }
    });
  }

  // loadSelectOptions() {
  //   this.tipoEquipamentoService.get().subscribe({
  //     next: (resposta: RespostaPaginada<TipoEquipamento>) => {
  //       this.tipo = resposta.results.filter(tipo => tipo.nome); // Filtra tipos válidos
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar tipos de equipamento:', err);
  //     }
  //   });

  //   this.setorService.get().subscribe({
  //     next: (resposta: RespostaPaginada<Setor>) => {
  //       this.setores = resposta.results.filter(setor => setor.nome); // Filtra setores válidos
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar setores:', err);
  //     }
  //   });

  //   this.servidorService.get().subscribe({
  //     next: (resposta: RespostaPaginada<Servidor>) => {
  //       this.servidores = resposta.results.filter(servidor => servidor.nome_completo); // Filtra servidores válidos
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar servidores:', err);
  //     }
  //   });
  // }

  delete(id: number): void {
    if (confirm('Confirma a exclusão do equipamento?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento excluído com sucesso!"
          });
        }
      });
    }
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

  openDeleteModal(id: number) {
    this.equipamentoSelecionado = this.registros.find(equipamento => equipamento.id === id) || null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (this.equipamentoSelecionado) {
      this.servico.delete(this.equipamentoSelecionado.id).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento excluído com sucesso!"
          });
          const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          deleteModal.hide();
        }
      });
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
        servidor: { id: this.addForm.value.servidor }
      };
      this.servico.save(novoEquipamento).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento adicionado com sucesso!"
          });
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
      tipo: equipamento.tipo?.id,
      setor: equipamento.setor?.id,
      servidor: equipamento.servidor_responsavel?.id,
      sala: equipamento.sala,
      estado: equipamento.estado,
      situacao: equipamento.situacao,
      data_aquisicao: equipamento.data_aquisicao
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmEdit() {
    if (this.equipamentoSelecionado && this.editForm.valid) {
      const equipamentoAtualizado: Equipamento = {
        ...this.equipamentoSelecionado,
        ...this.editForm.value,
        tipo: { id: this.editForm.value.tipo },
        setor: { id: this.editForm.value.setor },
        servidor: { id: this.editForm.value.servidor }
      };
      this.servico.save(equipamentoAtualizado).subscribe({
        complete: () => {
          this.get();
          this.servicoAlerta.enviarAlerta({
            tipo: ETipoAlerta.SUCESSO,
            mensagem: "Equipamento editado com sucesso!"
          });
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  validatePlaqueta(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 9) {
      inputElement.value = inputElement.value.slice(0, 9);
    }
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

  loadSetores() {
    this.setorService.get().subscribe({
      next: (resposta: RespostaPaginada<Setor>) => {
        this.setores = resposta.results; // Filtra setores válidos
        console.log('Setores:', this.setores);
      },
      error: (err) => {
        console.error('Erro ao carregar setores:', err);
      }
    });
  }

  loadTiposEquipamentos() {
    this.tipoEquipamentoService.get().subscribe({
      next: (resposta: RespostaPaginada<TipoEquipamento>) => {
        this.tipoEquipamento = resposta.results; // Filtra tipos válidos
        console.log('Tipos de equipamentos:', this.tipoEquipamento);
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de equipamentos:', err);
      }
    });
  }

  loadComponentesDisponiveis() {
    this.componenteService.get().subscribe({
      next: (resposta: RespostaPaginada<Componente>) => {
        this.componentesDisponiveis = resposta.results;
        console.log('Componentes disponíveis:', this.componentesDisponiveis);
      },
      error: (err) => {
        console.error('Erro ao carregar componentes disponíveis:', err);
      }
    });
  }
}