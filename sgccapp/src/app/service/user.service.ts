import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../model/equipamento.model';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { IService } from './i-service';
import { environment } from '../environments/environment';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IService<User> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/usuarios/';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  register(user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.post<User>(`${this.apiUrl}register/`, user, { headers });
  }

  getUserData(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}user_data/`, { headers });
  }

  getUserDataAdmin(id?: number): Observable<User | RespostaPaginada<User>> {
    const headers = this.getAuthHeaders();
    const url = id ? `${this.apiUrl}user_data_admin/${id}/` : `${this.apiUrl}user_data_admin/`;
    return this.http.get<User | RespostaPaginada<User>>(url, { headers });
  }

  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<User>> {
    let params = new HttpParams();

    if (termoBusca) {
      params = params.set('termoBusca', termoBusca);
    }

    if (paginacao) {
      params = params.set('page', paginacao.page.toString());
      params = params.set('pageSize', paginacao.pageSize.toString());
    }

    const headers = this.getAuthHeaders();
    return this.http.get<RespostaPaginada<User>>(`${this.apiUrl}user_data_admin/`, { headers, params });
  }


  updateUserData(user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}user_update/`, user, { headers });
  }

  updateUserDataAdmin(user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}user_update_admin/${user.id}/`;
    return this.http.put<User>(url, user, { headers });
  }

  delete(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}user_delete/${id}/`;
    return this.http.delete<void>(url, { headers });
  }
  getById(id: number): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}user_data_admin/${id}/`, { headers });
  }

  // Salva um novo usuário ou atualiza um usuário existente
  save(user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    if (user.id) {
      // Atualiza o usuário existente (requer permissão de administrador)
      return this.updateUserDataAdmin(user);
    } else {
      // Cria um novo usuário (requer permissão de administrador)
      return this.register(user);
    }
  }
}
