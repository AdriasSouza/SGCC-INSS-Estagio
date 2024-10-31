import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';

import { User } from '../model/user.model';
import { environment } from '../environments/environment';
import { IService } from './i-service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements IService<User> {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/config/usuario/';

  get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<RespostaPaginada<User>> {
    let url = this.apiUrl + "?";
    if (termoBusca) {
      url += "termoBusca=" + termoBusca;
    }
    if (paginacao) {
      url += "&page=" + paginacao.page;
      url += "&size=" + paginacao.size;
      paginacao.sort.forEach(campo => {
        url += "&sort=" + campo;
      });
    } else {
      url += "&unpaged=true";
    }
    return this.http.get<RespostaPaginada<User>>(url);
  }

  getById(id: number): Observable<User> {
    let url = this.apiUrl + id;
    return this.http.get<User>(url);
  }

  save(objeto: User): Observable<User> {
    let url = this.apiUrl;
    if (objeto.id) {
      return this.http.put<User>(url, objeto);
    } else {
      return this.http.post<User>(url, objeto);
    }
  }

  delete(id: number): Observable<void> {
    let url = this.apiUrl + id;
    return this.http.delete<void>(url);
  }

}
