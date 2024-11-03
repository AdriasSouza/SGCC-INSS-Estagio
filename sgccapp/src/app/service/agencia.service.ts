import { Injectable } from '@angular/core';
import { Agencia } from '../model/agencia.model';
import { IService } from './i-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgenciaService implements IService<Agencia> {

  constructor(
    private http: HttpClient
  ) { }
  apiUrl: string = environment.API_URL + '/api/usuarios/agencias/';

  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<Agencia>> {
    let params = new HttpParams();

    if (termoBusca) {
      params = params.set('termoBusca', termoBusca);
    }

    if (paginacao) {
      params = params.set('page', paginacao.page.toString());
      params = params.set('pageSize', paginacao.pageSize.toString());
    }

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<RespostaPaginada<Agencia>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<Agencia> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<Agencia>(url, { headers });
  }

  save(objeto: Agencia): Observable<Agencia> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl;
    if (objeto.id) {
      return this.http.put<Agencia>(url, objeto, { headers });
    } else {
      return this.http.post<Agencia>(url, objeto, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.delete<void>(url, { headers });
  }
}
