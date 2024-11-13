import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ILoginService } from './i-login.service';
import { environment } from '../../environments/environment';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class BasicLoginService implements ILoginService {

  constructor() {
    const userData = sessionStorage.getItem('usuario') || '{}';
    const usuario = JSON.parse(userData);
    this.usuarioAutenticado.next(usuario);
  }

  usuarioAutenticado: BehaviorSubject<User> = new BehaviorSubject<User>(<User>{});
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  login(email: string, password: string): Observable<any> {
    
    const credenciaisCodificadas = btoa(
      email + ':' + password
    );
    const opcoesHttp = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + credenciaisCodificadas
      })
    };
    const url = environment.API_URL + '/api/usuarios/login';

    return this.http.get<User>(url, opcoesHttp).pipe(
      tap((usuario: User) => {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        this.usuarioAutenticado.next(usuario);
        this.router.navigate(['/equipamentos']); // Redirecionar para /equipamentos após login bem-sucedido
      })
    );

  }

  logout(): void {
    sessionStorage.removeItem('usuario');
    document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/';
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const userData = sessionStorage.getItem('usuario') || '{}';
    const usuario = JSON.parse(userData);
    return Object.keys(usuario).length > 0;
  }

  getHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      withCredentials: true,
      headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
    })
  }

}
