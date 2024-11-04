import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../model/equipamento.model';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';
import { IService } from './i-service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService implements IService<Equipamento> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/api/gerenciamento/equipamento/';

  get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<RespostaPaginada<Equipamento>> {
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

    return this.http.get<RespostaPaginada<Equipamento>>(this.apiUrl, { headers, params });
  }

  getById(id: number): Observable<Equipamento> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id;
    return this.http.get<Equipamento>(url, { headers });
  }

  save(objeto: Equipamento): Observable<Equipamento> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('objeto:', objeto);
    const equipamentoData = {
      plaqueta: objeto.plaqueta,
      nome: objeto.nome,
      marca: objeto.marca,
      estado: objeto.estado,
      situacao: objeto.situacao,
      sala: objeto.sala,
      setor: objeto.setor?.id,
      tipo: objeto.tipo?.id,
      servidor: objeto.servidor?.id,
      data_aquisicao: objeto.data_aquisicao
    };
    const edit = {
      id: objeto.id,
      plaqueta: objeto.plaqueta,
      nome: objeto.nome,
      marca: objeto.marca,
      estado: objeto.estado,
      situacao: objeto.situacao,
      sala: objeto.sala,
      setor: objeto.setor?.id,
      tipo: objeto.tipo?.id,
      servidor: objeto.servidor?.id,
      data_aquisicao: objeto.data_aquisicao
    };
    if (objeto.id) {
      const url = this.apiUrl + objeto.id + '/';
      return this.http.put<Equipamento>(url, edit, { headers });
    } else {
      return this.http.post<Equipamento>(this.apiUrl, equipamentoData, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = this.apiUrl + id + '/';
    return this.http.delete<void>(url, { headers });
  }

  
}
