import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Servidor } from '../model/servidor.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { Observable } from 'rxjs';
import { IService } from './i-service';

@Injectable({
  providedIn: 'root'
})
export class ServidorService implements IService<Servidor> {

  constructor(
    private http: HttpClient
  ) { }
  apiUrl: string = environment.API_URL + '/api/usuarios/servidores/';

  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<Servidor>> {
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

    return this.http.get<RespostaPaginada<Servidor>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<Servidor> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<Servidor>(url, { headers });
  }

  save(objeto: Servidor): Observable<Servidor> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl;
    if (objeto.id) {
      const addservidorData = {
        inscricao_institucional: objeto.inscricao_institucional,
        nome_completo: objeto.nome_completo,
        setor: objeto.setor?.id,
        agencia: objeto.setor?.agencia?.id,
        chefe: objeto.chefe
      };
      const url = this.apiUrl + objeto.id + '/';
      return this.http.put<Servidor>(url, addservidorData, { headers });
    } else {
      // Criar um objeto com os campos necessários
      const servidorData = {
        inscricao_institucional: objeto.inscricao_institucional,
        nome_completo: objeto.nome_completo,
        setor: objeto.setor?.id,
        agencia: objeto.setor?.agencia?.id,
        chefe: objeto.chefe
      };
      console.log('servidorData:', servidorData);
      return this.http.post<Servidor>(url, servidorData, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.delete<void>(url, { headers });
  }
}
