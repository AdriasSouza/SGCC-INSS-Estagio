import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { IService } from './i-service';
import { environment } from '../environments/environment';
import { Componente } from '../model/componente.model';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService implements IService<Componente> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/gerenciamento/componente/';

  get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<RespostaPaginada<Componente>> {
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

    return this.http.get<RespostaPaginada<Componente>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<Componente> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<Componente>(url, { headers });
  }

  save(objeto: Componente): Observable<Componente> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl;
    const componenteData: any = {
      codigo: objeto.codigo,
      nome: objeto.nome,
      descricao: objeto.descricao,
      tipo: objeto.tipo?.id,
      fabricante: objeto.fabricante,
      tamanho_mem: objeto.tamanho_mem ?? null,
      n_serie: objeto?.n_serie,
      data_aquisicao: objeto.data_aquisicao
    };

    // Adiciona o campo tamanho_mem se ele existir no objeto
    if (objeto.tamanho_mem) {
      componenteData.tamanho_mem = objeto.tamanho_mem;
    }

    console.log('componenteData', componenteData);
    if (objeto.id) {
      const url = this.apiUrl + objeto.id + '/';
      return this.http.put<Componente>(url, componenteData, { headers });
    } else {
      return this.http.post<Componente>(url, componenteData, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers });
  }
}
