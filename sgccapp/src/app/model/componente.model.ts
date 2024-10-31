// componente.model.ts
import { TipoComponente } from './tipo-componente.model';

export type Componente = {
  id: number;                    // ID único do componente
  codigo: number;                // Código do componente
  nome: string;                  // Nome do componente
  descricao: string;             // Descrição do componente
  tipo?: TipoComponente;         // Relacionamento com tipo de componente
  fabricante: string;            // Nome do fabricante
  tamanho_mem?: number;          // Tamanho da memória, opcional
  n_serie?: string;              // Número de série, opcional
  data_aquisicao: Date;          // Data de aquisição
}