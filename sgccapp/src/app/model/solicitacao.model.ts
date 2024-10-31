// solicitacao.model.ts

import { User } from "./user.model";

export type Solicitacao = {
  id: number;                     // ID único da solicitação
  user: User | null;              // Relacionamento com o usuário, pode ser nulo
  data: Date;                     // Data de criação da solicitação
  status: 'ATENDIDO' | 'ANALISE' | 'NEGADO' | 'ENCAMINHADO'; // Status da solicitação com opções pré-definidas
  descricao: string;              // Descrição da solicitação
}