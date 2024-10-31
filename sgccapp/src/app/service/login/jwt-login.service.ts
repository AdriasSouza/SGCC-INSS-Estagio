import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginService } from './i-login.service';
import { User } from '../../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtLoginService implements ILoginService {

  constructor() {
    const userData = sessionStorage.getItem('usuario') || '{}';
    const usuario = JSON.parse(userData);
    this.usuarioAutenticado.next(usuario);
    if (this.isLoggedIn()) {
      this.agendarRenovacaoToken();
    }
  }

  private apiUrl = 'http://127.0.0.1:8000/api/usuarios';
  usuarioAutenticado: BehaviorSubject<User> = new BehaviorSubject<User>(<User>{});
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private fezRequisicao: boolean = false;
  private intervaloRenovacao: any;

  private agendarRenovacaoToken(): void {
    const intervalo = 1000 * 10;
    this.intervaloRenovacao = setInterval(() => {
      if (this.fezRequisicao) {
        this.renovarToken();
        this.fezRequisicao = false;
      }
    }, intervalo);
  }

  private renovarToken(): void {
    const url = environment.API_URL + '/refresh';
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (token: string) => {
        this.configurarSessaoUsuario(token);
      }
    })
  }

  login(email: string, password: string): void {
    this.http.post(`${this.apiUrl}/login/`, { email, password }, { responseType: 'text' }).subscribe({
      next: (token: string) => {
        this.configurarSessaoUsuario(token);
        this.agendarRenovacaoToken();
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    });
  }

  private configurarSessaoUsuario(token: string) {
    const payload = token.split('.')[1];
    const payloadDecodificado = atob(payload);
    const conteudoToken = JSON.parse(payloadDecodificado);
    const tokenExp = conteudoToken.exp * 1000;

    const usuario = <User>{};
    usuario.email = conteudoToken.nomeCompleto;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    sessionStorage.setItem('tokenExp', tokenExp.toString());

    this.usuarioAutenticado.next(usuario);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('tokenExp');
    document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/';
    clearInterval(this.intervaloRenovacao);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if (token == null) {
      return false;
    }

    const tokenExp = sessionStorage.getItem('tokenExp');
    const tempoExpiracao = new Date(Number(tokenExp));
    const agora = new Date();
    const estaExpirado = tempoExpiracao < agora;
    if (estaExpirado) {
      this.logout();
    }

    return !estaExpirado;
  }

  getHeaders(request: HttpRequest<any>): HttpRequest<any> {
    if (this.isLoggedIn()) {
      this.fezRequisicao = true;
      const token = sessionStorage.getItem('token');
      return request.clone({
        withCredentials: true,
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
    }
    return request;
  }
}