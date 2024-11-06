// setor.model.ts

import { Agencia } from "./agencia.model";   // Importa a interface Agencia para definir o setor

export type Setor = {
  id: number;              // ID único do setor
  codigo?: number;   // Código do setor, pode ser nulo
  nome?: string;     // Nome do setor, pode ser nulo
  agencia?: Agencia; // Relacionamento com a agência, pode ser nulo
}