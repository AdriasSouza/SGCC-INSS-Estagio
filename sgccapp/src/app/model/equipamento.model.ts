// equipamento.model.ts
import { Setor } from './setor.model';
import { TipoEquipamento } from './tipo-equipamento.model';
import { Servidor } from './servidor.model';
import { Componente } from './componente.model';

export type Equipamento = {
  id: number;
  plaqueta?: string;
  nome?: string;
  marca?: string;
  estado: 'DEFASADO' | 'ATENÇÃO' | 'BOM' | 'NOVO';
  situacao: 'EM_USO' | 'RESERVA' | 'MANUTENCAO' | 'BAIXA' | 'ALIENACAO' | 'PERDIDO' | 'ROUBADO';
  sala?: number;
  setor?: Setor;
  tipo?: TipoEquipamento;
  servidor_responsavel?: Servidor;
  componentes?: Componente[];
  data_aquisicao?: Date; // ISO 8601 date string
}