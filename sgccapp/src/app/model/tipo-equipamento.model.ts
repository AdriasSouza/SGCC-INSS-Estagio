// tipo-equipamento.model.ts
export type TipoEquipamento = {
  id: number;                   // ID único do tipo de equipamento
  nome: string;                 // Nome do tipo de equipamento
  descricao?: string;           // Descrição do tipo de equipamento, opcional
}