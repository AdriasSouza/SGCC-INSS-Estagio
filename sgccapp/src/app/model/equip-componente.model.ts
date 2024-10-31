// equip-componente.model.ts
import { Equipamento } from './equipamento.model';
import { Componente } from './componente.model';

export type EquipComponente = {
  id: number;                    // ID único da relação EquipComponente
  equip: Equipamento[];          // Lista de equipamentos relacionados
  componente: Componente[];      // Lista de componentes relacionados
}