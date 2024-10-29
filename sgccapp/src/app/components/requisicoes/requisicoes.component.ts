import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;

// requisicao.model.ts
export interface Requisicao {
  solicitante: string;
  setor: string;
  status: 'atendido' | 'em analise' | 'negado';
  data: Date;
  descricao?: string;
}

@Component({
  selector: 'app-requisicoes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './requisicoes.component.html',
  styleUrls: ['./requisicoes.component.css']
})
export class RequisicoesComponent implements OnInit {
  requisicoes: Requisicao[] = [];
  requisicaoSelecionada: Requisicao | null = null;

  ngOnInit(): void {
    // Populando a tabela com algumas requisições
    this.requisicoes = [
      { solicitante: 'João Silva', setor: 'TI', status: 'em analise', data: new Date('2024-01-15'), descricao: 'Requisição de novo computador.' },
      { solicitante: 'Maria Souza', setor: 'RH', status: 'atendido', data: new Date('2024-02-12'), descricao: 'Requisição de cadeira ergonômica.' },
      { solicitante: 'Carlos Ferreira', setor: 'Financeiro', status: 'negado', data: new Date('2024-03-08'), descricao: 'Requisição de software financeiro.' },
      { solicitante: 'Ana Paula', setor: 'Marketing', status: 'em analise', data: new Date('2024-04-10'), descricao: 'Requisição de câmera fotográfica.' }
    ];
  }

  aprovarRequisicao(index: number) {
    this.requisicoes[index].status = 'atendido';
  }

  encaminharRequisicao(index: number) {
    this.requisicoes[index].status = 'em analise';
  }

  excluirRequisicao(index: number) {
    this.requisicoes.splice(index, 1);
  }

  openDetalhesModal(index: number) {
    this.requisicaoSelecionada = this.requisicoes[index];
    const detalhesModal = new bootstrap.Modal(document.getElementById('detalhesModal'));
    detalhesModal.show();
  }
}