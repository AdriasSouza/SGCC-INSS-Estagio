import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IService } from './i-service';
import { environment } from '../environments/environment';
import { Equipamento } from '../model/equipamento.model';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';

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
    const equipamentoData: any = {
      plaqueta: objeto?.plaqueta,
      nome: objeto?.nome,
      marca: objeto?.marca || null,
      estado: objeto.estado,
      situacao: objeto.situacao,
      sala: objeto?.sala || null,
      setor: objeto?.setor?.id || null,
      tipo: objeto.tipo?.id || null,
      servidor: objeto.servidor_responsavel?.id || null,
      data_aquisicao: objeto?.data_aquisicao || null
    };

    if (objeto.componentes && objeto.componentes.length > 0) {
      equipamentoData.componentes = objeto.componentes.map(componente => componente.id);
    } //else {
      //equipamentoData.componentes = null;
    //}

    console.log(equipamentoData);
    if (objeto.id) {
      const url = this.apiUrl + objeto.id + '/';
      console.log('Dados edição:', equipamentoData);
      return this.http.put<Equipamento>(url, equipamentoData, { headers });
    } else {
      const equipamentoData: any = {
        plaqueta: objeto?.plaqueta || null,
        nome: objeto?.nome || null,
        marca: objeto?.marca || null,
        estado: objeto.estado || null,
        situacao: objeto.situacao || null,
        sala: objeto?.sala || null,
        setor: objeto?.setor?.id || null,
        tipo: objeto.tipo?.id || null,
        servidor: objeto.servidor_responsavel?.id || null,
        data_aquisicao: objeto?.data_aquisicao || null
      };
      console.log('Dados criação:', equipamentoData);
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
