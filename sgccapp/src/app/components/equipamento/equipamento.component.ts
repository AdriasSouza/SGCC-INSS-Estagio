import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//interface para simular o comportamento do model
interface Equipamento {
  plaqueta: number;
  nome: string;
  marca: string;
  tipo: string;
  setor: string;
  estado: string;
  situacao: string;
  responsavel: string;
  sala: number;
  data: Date; // Adicionado para simular a data de aquisição
}

@Component({
  selector: 'app-equipamento',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.scss']
})

export class EquipamentoComponent {
  // Lista inicial de equipamentos (pode ser carregada via serviço em um cenário real)
  equipamentos: Equipamento[] = [
    { plaqueta: 371298, nome: 'Positivo Micro', marca: 'Positivo', tipo: 'Computador', setor: 'Gerência', estado: 'Bom', situacao: 'Estoque', responsavel: 'Rusemberg', sala: 101, data: new Date('2022-01-01') },
    { plaqueta: 371299, nome: 'Monitor LG', marca: 'LG', tipo: 'Monitor', setor: 'Logística', estado: 'Novo', situacao: 'Em uso', responsavel: 'Ana', sala: 102, data: new Date('2022-02-01') },
    // Mais equipamentos...
  ];

  // Filtros
  searchText: string = '';
  selectedMarca: string = '';
  selectedTipo: string = '';
  selectedSetor: string = '';
  selectedEstado: string = '';
  selectedSituacao: string = '';

  // Equipamentos filtrados
  equipamentosFiltrados: Equipamento[] = [];

  ngOnInit() {
    this.equipamentosFiltrados = this.equipamentos;
  }

  // Função para filtrar a lista de equipamentos de acordo com os filtros aplicados
  filterEquipamentos() {
    this.equipamentosFiltrados = this.equipamentos.filter(equipamento => {
      const matchesSearch = this.searchText === '' || equipamento.plaqueta.toString().includes(this.searchText) || equipamento.sala.toString().includes(this.searchText) || equipamento.responsavel.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesMarca = this.selectedMarca === '' || equipamento.marca === this.selectedMarca;
      const matchesTipo = this.selectedTipo === '' || equipamento.tipo === this.selectedTipo;
      const matchesSetor = this.selectedSetor === '' || equipamento.setor === this.selectedSetor;
      const matchesEstado = this.selectedEstado === '' || equipamento.estado === this.selectedEstado;
      const matchesSituacao = this.selectedSituacao === '' || equipamento.situacao === this.selectedSituacao;

      return matchesSearch && matchesMarca && matchesTipo && matchesSetor && matchesEstado && matchesSituacao;
    });
  }

  // Função chamada quando o campo de busca é alterado
  onSearchTextChange() {
    this.filterEquipamentos();
  }

  // Funções chamadas ao alterar os selects
  onMarcaChange(marca: string) {
    this.selectedMarca = marca;
    this.filterEquipamentos();
  }

  onTipoChange(tipo: string) {
    this.selectedTipo = tipo;
    this.filterEquipamentos();
  }

  onSetorChange(setor: string) {
    this.selectedSetor = setor;
    this.filterEquipamentos();
  }

  onEstadoChange(estado: string) {
    this.selectedEstado = estado;
    this.filterEquipamentos();
  }

  onSituacaoChange(situacao: string) {
    this.selectedSituacao = situacao;
    this.filterEquipamentos();
  }
}
