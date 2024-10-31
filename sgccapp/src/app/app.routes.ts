import { Routes } from '@angular/router';
import { EquipamentoComponent } from './components/equipamento/equipamento.component';
import { LoginComponent } from './components/login/login.component';
import { ManutencaoComponent } from './components/manutencao/manutencao.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { AgenciasComponent } from './components/agencias/agencias.component';
import { ServidoresComponent } from './components/servidores/servidores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComponentesComponent } from './components/componentes/componentes.component';
import { RequisicoesComponent } from './components/requisicoes/requisicoes.component';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], children: [
    { path: 'equipamentos', component: EquipamentoComponent },
    { path: 'manutencao', component: ManutencaoComponent },
    { path: 'componentes', component: ComponentesComponent },
    { path: 'agencias', component: AgenciasComponent },
    { path: 'servidores', component: ServidoresComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'relatorios', component: RelatoriosComponent },
    { path: 'requisicoes', component: RequisicoesComponent }
  ] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];