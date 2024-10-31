import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<Equipamento[]> {
    let url = this.apiUrl + "?";
    if (termoBusca) {
      url += "termoBusca=" + termoBusca;
    }
    // Adicionar o token JWT no cabeçalho da requisição
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Equipamento[]>(url, { headers });
  }

  getById(id: number): Observable<Equipamento> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url = this.apiUrl + id;
    return this.http.get<Equipamento>(url, { headers });
  }

  save(objeto: Equipamento): Observable<Equipamento> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url = this.apiUrl;
    if (objeto.id) {
      return this.http.put<Equipamento>(url, objeto, { headers });
    } else {
      return this.http.post<Equipamento>(url, objeto, { headers });
    }
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url = this.apiUrl + id;
    return this.http.delete<void>(url, { headers });
  }
}


// import { Injectable } from '@angular/core';
// import { IService } from './i-service';
// import { HttpClient } from '@angular/common/http';
// import { Equipamento } from '../model/equipamento.model';
// import { environment } from '../environments/environment';
// import { RequisicaoPaginada } from '../model/requisicao-paginada';
// import { Observable } from 'rxjs';
// import { RespostaPaginada } from '../model/resposta-paginada';

// @Injectable({
//   providedIn: 'root'
// })
// export class EquipamentoService implements IService<Equipamento>{

//   constructor(
//     private http: HttpClient
//   ) { }

//   apiUrl: string = environment.API_URL + '/api/gerenciamento/equipamento/';

//   get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<RespostaPaginada<Equipamento>> {
//     let url = this.apiUrl + "?";
//     if (termoBusca) {
//       url += "termoBusca=" + termoBusca;
//     }
//     if (paginacao) {
//       url += "&page=" + paginacao.page;
//       url += "&size=" + paginacao.size;
//       paginacao.sort.forEach(campo => {
//         url += "&sort=" + campo;
//       });
//     } else {
//       url += "&unpaged=true";
//     }
//     return this.http.get<RespostaPaginada<Equipamento>>(url);
//   }

//   getById(id: number): Observable<Equipamento> {
//     let url = this.apiUrl + id;
//     return this.http.get<Equipamento>(url);
//   }

//   save(objeto: Equipamento): Observable<Equipamento> {
//     let url = this.apiUrl;
//     if (objeto.id) {
//       return this.http.put<Equipamento>(url, objeto);
//     } else {
//       return this.http.post<Equipamento>(url, objeto);
//     }
//   }

//   delete(id: number): Observable<void> {
//     let url = this.apiUrl + id;
//     return this.http.delete<void>(url);
//   }
// }
