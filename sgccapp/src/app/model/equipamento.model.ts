// equipamento.model.ts
import { Setor } from './setor.model';
import { TipoEquipamento } from './tipo-equipamento.model';
import { Servidor } from './servidor.model';

export type Equipamento = {
  id: number;                          // ID único do equipamento
  plaqueta?: string;                   // Plaqueta do equipamento, opcional
  nome?: string;                       // Nome do equipamento, opcional
  marca?: string;                      // Marca do equipamento, opcional
  estado: 'DEFASADO' | 'ATENÇÃO' | 'BOM' | 'NOVO';  // Estado do equipamento com opções definidas
  situacao: 'EM_USO' | 'RESERVA' | 'MANUTENCAO' | 'BAIXA' | 'ALIENACAO' | 'PERDIDO' | 'ROUBADO'; // Situação do equipamento
  sala?: number;                       // Sala onde o equipamento está, opcional
  setor?: Setor;                       // Relacionamento com setor, opcional
  tipo: TipoEquipamento;              // Relacionamento com tipo de equipamento, opcional
  servidor?: Servidor;                 // Relacionamento com servidor, opcional
  data_aquisicao?: Date;               // Data de aquisição do equipamento, opcional
}