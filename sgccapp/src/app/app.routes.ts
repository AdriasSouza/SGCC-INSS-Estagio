import { Routes } from '@angular/router';
import { EquipamentoComponent } from './components/equipamentos/equipamento/equipamento.component';

export const routes: Routes = [
    { path: '', canActivate: [], children: [
        { path: 'equipamentos', component: EquipamentoComponent }
    ] },
];
