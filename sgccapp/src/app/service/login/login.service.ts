// import { inject, Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { User } from '../../model/user.model';
// import { ILoginService } from './i-login.service';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService implements ILoginService {

//   constructor() {
//     const userData = sessionStorage.getItem('usuario') || '{}';
//     const usuario = JSON.parse(userData);
//     this.usuarioAutenticado.next(usuario);
//     if (this.isLoggedIn()) {
//       this.agendarRenovacaoToken();
//     }
//   }

//   private apiUrl = 'http://127.0.0.1:8000/api/usuarios';
//   usuarioAutenticado: BehaviorSubject<User> = new BehaviorSubject<User>(<User>{});
//   private http: HttpClient = inject(HttpClient);
//   private router: Router = inject(Router);
//   private fezRequisicao: boolean = false;
//   private intervaloRenovacao: any;
//   errorMessage: string | null = null

//   private agendarRenovacaoToken(): void {
//     const intervalo = 1000 * 10;
//     this.intervaloRenovacao = setInterval(() => {
//       if (this.fezRequisicao) {
//         this.renovarToken();
//         this.fezRequisicao = false;
//       }
//     }, intervalo);
//   }

//   private renovarToken(): void {
//     this.http.get(`${this.apiUrl}/refresh/`, { responseType: 'text' }).subscribe({
//       next: (token: string) => {
//         this.configurarSessaoUsuario(token);
//       }
//     })
//   }

//   login(usuario: User) {
//     this.http.post(`${this.apiUrl}/login/`, usuario, { responseType: 'text' }).subscribe({
//       next: (token: string) => {
//         // localStorage.setItem('token', response.jwt);
//         this.configurarSessaoUsuario(token);
//         this.agendarRenovacaoToken();
//       },
//       error: () => {
//         this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
//       },
//       complete: () => {
//         this.router.navigate(['/login']);
//       // catchError(this.handleError<any>('login'))
//       }
//     });
//   }

//   logout(): void {
//     this.http.post(`${this.apiUrl}/logout/`, {}).subscribe({
//       next: () => {
//         localStorage.removeItem('token');
//         this.usuarioAutenticado.next(<User>{});
//         this.router.navigate(['/login']);
//       },
//       error: (error) => {
//         console.error('Erro ao fazer logout:', error);
//       }
//     });
//   }

//   private configurarSessaoUsuario(token: string) {
//     const payload = token.split('.')[1];
//     const payloadDecodificado = atob(payload);
//     const conteudoToken = JSON.parse(payloadDecodificado);
//     const tokenExp = conteudoToken.exp * 1000;

//     const usuario = <User>{};
//     usuario.email = conteudoToken.email;

//     sessionStorage.setItem('token', token);
//     sessionStorage.setItem('usuario', JSON.stringify(usuario));
//     sessionStorage.setItem('tokenExp', tokenExp.toString());

//     this.usuarioAutenticado.next(usuario);
//   }

//   isLoggedIn(): boolean {
//     const token = sessionStorage.getItem('token');
//     if (token == null) {
//       return false;
//     }
    
//     const tokenExp = sessionStorage.getItem('tokenExp');
//     const tempoExpiracao = new Date(Number(tokenExp));
//     const agora = new Date();
//     const estaExpirado = tempoExpiracao < agora;
//     if (estaExpirado) {
//       this.logout();
//     }

//     return !estaExpirado;
//   }

//   fetchCurrentUser(): void {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//       this.http.get<User>(`${this.apiUrl}/user/`, { headers }).subscribe({
//         next: (user) => this.usuarioAutenticado.next(user),
//         error: (error) => console.error('Erro ao buscar usuário atual:', error)
//       });
//     } else {
//       console.error('Token não encontrado');
//     }
//   }

//   getHeaders(request: HttpRequest<any>): HttpRequest<any> {
//     if (this.isLoggedIn()) {
//       const token = localStorage.getItem('token');
//       return request.clone({
//         headers: request.headers.set('Authorization', `Bearer ${token}`)
//       });
//     }
//     return request;
//   }

//   private handleError<T>(operation = 'operation', result?: T) {
//     return (error: any): Observable<T> => {
//       console.error(error);
//       return of(result as T);
//     };
//   }
// }