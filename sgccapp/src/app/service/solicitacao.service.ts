import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { IService } from './i-service';
import { environment } from '../environments/environment';
import { Solicitacao } from '../model/solicitacao.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService implements IService<Solicitacao> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/usuarios/solicitacoes/';

  getSolicita(): Observable<Solicitacao[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Solicitacao[]>(this.apiUrl, { headers });
  }

  get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<RespostaPaginada<Solicitacao>> {
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

    return this.http.get<RespostaPaginada<Solicitacao>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<Solicitacao> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<Solicitacao>(url, { headers });
  }

  save(objeto: Solicitacao): Observable<Solicitacao> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Verificar e converter data para Date se necessário
    const data = typeof objeto.data === 'string' ? new Date(objeto.data) : objeto.data;
    
    // Criar um objeto com os campos necessários
    const solicitacaoData = {
      user: objeto.user ? objeto.user.id : null,
      data: data.toISOString(),
      status: objeto.status,
      descricao: objeto.descricao,
      justificativa: objeto.justificativa
    };

    console.log('Enviando dados para a API:', solicitacaoData); // Adiciona log para depuração

    if (objeto.id) {
      const url = this.apiUrl + objeto.id + '/';
      return this.http.put<Solicitacao>(url, solicitacaoData, { headers });
    } else {
      return this.http.post<Solicitacao>(this.apiUrl, solicitacaoData, { headers });
    }
  }
  
  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id + '/';
    return this.http.delete<void>(url, { headers });
  }
}
