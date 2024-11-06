import { Routes } from '@angular/router';
import { EquipamentoComponent } from './components/equipamento/equipamento.component';
import { LoginComponent } from './components/login/login.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { AgenciasComponent } from './components/agencias/agencias.component';
import { ServidoresComponent } from './components/servidores/servidores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComponentesComponent } from './components/componentes/componentes.component';
import { authGuard } from './service/auth.guard';
import { SolicitacaoComponent } from './components/solicitacao/solicitacao.component';
import { ManutencaoComponent } from './components/manutencao/manutencao.component';
import { TipoComponenteComponent } from './components/tipo-componente/tipo-componente.component';
import { TipoEquipamentoComponent } from './components/tipo-equipamento/tipo-equipamento.component';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], children: [
    { path: 'equipamentos', component: EquipamentoComponent },
    { path: 'componentes', component: ComponentesComponent },
    { path: 'agencias', component: AgenciasComponent },
    { path: 'servidores', component: ServidoresComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'relatorios', component: RelatoriosComponent },
    { path: 'manutencao', component: ManutencaoComponent },
    { path: 'solicitacao', component: SolicitacaoComponent },
    { path: 'tipo-comp', component: TipoComponenteComponent },
    { path: 'tipo-equip', component: TipoEquipamentoComponent },

  ] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];