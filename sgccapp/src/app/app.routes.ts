import { Routes } from '@angular/router';
import { EquipamentoComponent } from './components/equipamento/equipamento.component';
import { LoginComponent } from './components/login/login.component';
import { ManutencaoComponent } from './components/manutencao/manutencao.component';
import { PecasComponent } from './components/pecas/pecas.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { AgenciasComponent } from './components/agencias/agencias.component';
import { ServidoresComponent } from './components/servidores/servidores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';


export const routes: Routes = [
    { path: '', canActivate: [], children: [
        { path: 'equipamentos', component: EquipamentoComponent },
        { path: 'login', component: LoginComponent },
        { path: 'manutencao', component: ManutencaoComponent},
        { path: 'pecas', component: PecasComponent},
        { path: 'agencias', component: AgenciasComponent},
        { path: 'servidores', component: ServidoresComponent},
        { path: 'usuarios', component: UsuariosComponent},
        { path: 'relatorios', component: RelatoriosComponent}
    ] },
];
