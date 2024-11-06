// servidor.model.ts
import { Setor } from './setor.model';
import { User } from './user.model';

export type Servidor = {
  id: number;                     // ID único do servidor
  inscricao_institucional: string; // Inscrição institucional do servidor
  nome_completo: string;          // Nome completo do servidor
  setor?: Setor;            // Relacionamento com o setor, pode ser nulo
  chefe: boolean;                 // Indica se o servidor é chefe ou não
}