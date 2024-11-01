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
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/login/refresh/`, { refresh: refreshToken }).subscribe({
        next: (response: any) => {
          const newAccessToken = response.access;
          this.configurarSessaoUsuario(newAccessToken, refreshToken);
        },
        error: () => {
          this.logout();
        }
      });
    } else {
      this.logout();
    }
  }

  login(email: string, password: string): void {
    this.http.post(`${this.apiUrl}/login/`, { email, password }).subscribe({
      next: (response: any) => {
        const accessToken = response.access;
        const refreshToken = response.refresh;
        this.configurarSessaoUsuario(accessToken, refreshToken);
        this.agendarRenovacaoToken();
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    });
  }

  private configurarSessaoUsuario(accessToken: string, refreshToken: string) {
    const payload = accessToken.split('.')[1];
    const payloadDecodificado = atob(payload);
    const conteudoToken = JSON.parse(payloadDecodificado);
    const tokenExp = conteudoToken.exp * 1000;

    const usuario = <User>{};
    usuario.email = conteudoToken.email;
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    sessionStorage.setItem('tokenExp', tokenExp.toString());

    this.usuarioAutenticado.next(usuario);
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('tokenExp');
    clearInterval(this.intervaloRenovacao);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('access_token');
    if (!token) return false;

    const tokenExp = sessionStorage.getItem('tokenExp');
    const tempoExpiracao = new Date(Number(tokenExp));
    const agora = new Date();
    const estaExpirado = tempoExpiracao < agora;

    if (estaExpirado) {
      this.renovarToken();
      return false; // O token expirou e será renovado
    }

    return true;
  }

  getHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const token = sessionStorage.getItem('access_token');
    if (this.isLoggedIn() && token) {
      this.fezRequisicao = true;
      return request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
    }
    return request;
  }
}
