import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { EquipamentoComponent } from './components/equipamento/equipamento.component';
// import { LoginService } from './service/login/login.service';
// import { AuthInterceptor } from './interceptor/auth.interceptor';
// import { ErroInterceptor } from './interceptor/erro.interceptor';

const routes: Routes = [
  { path: '', redirectTo: '/equipamentos', pathMatch: 'full' },
  { path: 'equipamentos', component: EquipamentoComponent }
];

@NgModule({
  declarations: [
    // Declare components here if they are not standalone
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    EquipamentoComponent // Import standalone component here
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErroInterceptor, multi: true }
  ]
})
export class AppModule { }