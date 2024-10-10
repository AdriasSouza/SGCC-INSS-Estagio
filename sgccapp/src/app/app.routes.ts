import { Routes } from '@angular/router';
import { EquipamentoComponent } from './components/equipamento/equipamento.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
    { path: '', canActivate: [], children: [
        { path: 'equipamentos', component: EquipamentoComponent },
        { path: 'login', component: LoginComponent }
    ] },
];
