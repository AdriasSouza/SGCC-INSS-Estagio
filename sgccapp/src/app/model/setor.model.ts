// setor.model.ts

import { Agencia } from "./agencia.model";   // Importa a interface Agencia para definir o setor

export type Setor = {
  id: number;              // ID único do setor
  codigo: number | null;   // Código do setor, pode ser nulo
  nome: string | null;     // Nome do setor, pode ser nulo
  agencia: Agencia | null; // Relacionamento com a agência, pode ser nulo
}