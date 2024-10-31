import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TheadOrdenacao } from './thead-ordenacao';

@Component({
  selector: 'thead[app-thead-ordenacao]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thead-ordenacao.component.html',
  styles: ``
})
export class TheadOrdenacaoComponent {

  @Input() colunas: TheadOrdenacao = [];
  @Output() ordenacaoAtualizada = new EventEmitter<string[]>();
  ordenacao: string[] = [];

  ordenar(campo: string): void {
    if (campo) {
      if (this.ordenacao.includes(campo)) {
        const indice = this.ordenacao.indexOf(campo);
        this.ordenacao[indice] = campo + ",desc";
        // Alternativa
        // this.ordenacao = this.ordenacao.map(item => item == campo ? campo + ",desc" : item);
      } else if (this.ordenacao.includes(campo + ",desc")) {
        const indice = this.ordenacao.indexOf(campo + ",desc");
        this.ordenacao.splice(indice, 1);
        // Alternativa
        // this.ordenacao = this.ordenacao.filter(item => item != campo + ",desc");
      } else {
        this.ordenacao.push(campo);
      }
      this.ordenacaoAtualizada.emit(this.ordenacao);
    }
  }

  definirClasse(campo: string): string {
    let classe = '';
    if (this.ordenacao.length > 0) {
      if (this.ordenacao.includes(campo)) {
        classe = 'ativo-asc';
      } else if (this.ordenacao.includes(campo + ",desc")) {
        classe = 'ativo-desc';
      }
    }
    return classe;
  }

}
