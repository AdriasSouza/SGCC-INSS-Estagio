// manutencao.model.ts
import { Equipamento } from './equipamento.model';
import { Servidor } from './servidor.model';

export type Manutencao = {
  id: number;                  // ID único da manutenção
  codigo?: number;             // Código da manutenção, opcional
  data?: Date;                 // Data da manutenção, opcional
  descricao?: string;          // Descrição da manutenção, opcional
  equipamento?: Equipamento;   // Relacionamento com o equipamento
  responsavel?: Servidor;      // Relacionamento com o servidor responsável
}
