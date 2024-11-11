import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Setor } from '../model/setor.model';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IService } from './i-service';

@Injectable({
  providedIn: 'root'
})
export class SetorService implements IService<Setor> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/usuarios/setores/';

  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<Setor>> {
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

    return this.http.get<RespostaPaginada<Setor>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<Setor> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<Setor>(url, { headers });
  }

  save(objeto: Setor): Observable<Setor> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl;
    console.log('Requisição:', objeto);
    const setorData: any = {
      codigo: objeto.codigo,
      nome: objeto.nome,
      agencia: objeto.agencia?.id,
      chefe: objeto.chefe?.id
    };

    if (objeto.servidores && objeto.servidores.length > 0) {
      setorData.servidores = objeto.servidores.map(servidor => servidor.id);
    }
    
    if (objeto.id) {
      const url = this.apiUrl + objeto.id + '/';
      console.log('Dados edição:', setorData);
      return this.http.put<Setor>(url, setorData, { headers });
    } else {
      console.log('Dados criação:', setorData);
      return this.http.post<Setor>(url, setorData, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id + '/';
    return this.http.delete<void>(url, { headers });
  }
}