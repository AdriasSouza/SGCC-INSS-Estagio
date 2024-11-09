import { Injectable } from '@angular/core';
import { TipoComponente } from '../model/tipo-componente.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IService } from './i-service';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoComponenteService implements IService<TipoComponente> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/gerenciamento/tipo-equipamento/';

  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<TipoComponente>> {
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

    return this.http.get<RespostaPaginada<TipoComponente>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<TipoComponente> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<TipoComponente>(url, { headers });
  }

  save(objeto: TipoComponente): Observable<TipoComponente> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl;
    if (objeto.id) {
      return this.http.put<TipoComponente>(url, objeto, { headers });
    } else {
      return this.http.post<TipoComponente>(url, objeto, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id + '/';
    return this.http.delete<void>(url, { headers });
  }
}
