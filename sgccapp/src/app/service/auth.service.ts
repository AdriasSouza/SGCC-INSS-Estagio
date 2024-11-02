import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}usuarios/login/`, { username, password }).subscribe(
      (res: any) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.router.navigate(['/equipamentos']); // Redireciona o usuário após o login
      },
      (error) => {
        console.error('Erro no login:', error);
      }
    );
  }

  logout(): void {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token'); // Obtém o refresh token

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    // Faz a requisição de logout usando o refresh token
    this.http.post(`${this.apiUrl}usuarios/logout/`, { refresh_token: refreshToken }, { headers })
      .subscribe(
        () => {
          localStorage.removeItem('access_token');  // Remove o token de acesso
          localStorage.removeItem('refresh_token');  // Remove o refresh token
          this.router.navigate(['/login']);           // Redireciona para a página de login
          console.log('Logout successful');
        },
        (error) => {
          console.error('Erro ao fazer logout:', error);
          // Trate o erro como achar necessário
        }
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  refreshAccessToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      return this.http.post(`${this.apiUrl}usuarios/login/refresh/`, { refresh: refreshToken }).pipe(
        tap((res: any) => {
          localStorage.setItem('access_token', res.access);
        }),
        catchError((error) => {
          console.error('Erro ao renovar o token:', error);
          this.logout();
          return of(false); // Retorna false em caso de erro
        }),
        tap(() => true) // Retorna true em caso de sucesso
      );
    } else {
      return of(false); // Retorna false se o refresh token não estiver presente
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
