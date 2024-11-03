import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespostaPaginada } from '../model/resposta-paginada';
import { environment } from '../environments/environment';
import { TipoEquipamento } from '../model/tipo-equipamento.model';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { IService } from './i-service';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipamentoService implements IService<TipoEquipamento> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/gerenciamento/tipo-equipamento/';

  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<TipoEquipamento>> {
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

    return this.http.get<RespostaPaginada<TipoEquipamento>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<TipoEquipamento> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<TipoEquipamento>(url, { headers });
  }

  save(objeto: TipoEquipamento): Observable<TipoEquipamento> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl;
    if (objeto.id) {
      return this.http.put<TipoEquipamento>(url, objeto, { headers });
    } else {
      return this.http.post<TipoEquipamento>(url, objeto, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.delete<void>(url, { headers });
  }
}
