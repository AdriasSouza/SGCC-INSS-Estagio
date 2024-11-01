import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post(`${this.apiUrl} usuarios/login/`, { username, password }).subscribe(
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      return this.http.post(`${this.apiUrl}/login/refresh/`, { refresh: refreshToken }).subscribe(
        (res: any) => {
          localStorage.setItem('access_token', res.access);
        },
        (error) => {
          console.error('Erro ao renovar o token:', error);
          this.logout();
        }
      );
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
