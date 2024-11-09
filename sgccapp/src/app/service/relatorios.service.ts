import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  private baseUrl = 'http://localhost:8000/api/gerenciamento';

  constructor(private http: HttpClient) { }

  exportSetoresCsv(setorId: number): Observable<Blob> {
    const url = `http://127.0.0.1:8000/api/usuarios/export-servidores-csv/`;
    const params = new HttpParams().set('setor_id', setorId.toString());
    return this.http.get(url, { params, responseType: 'blob' });
  }

  exportEquipamentosCsv(dataInicio: string, dataFim: string): Observable<Blob> {
    const url = `${this.baseUrl}/export-equipamentos-csv/`;
    const params = new HttpParams()
      .set('data_inicio', dataInicio)
      .set('data_fim', dataFim);
    return this.http.get(url, { params, responseType: 'blob' });
  }

  exportManutencoesCsv(dataInicio: string, dataFim: string): Observable<Blob> {
    const url = `${this.baseUrl}/export-manutencoes-csv/`;
    const params = new HttpParams()
      .set('data_inicio', dataInicio)
      .set('data_fim', dataFim);
    return this.http.get(url, { params, responseType: 'blob' });
  }

  exportComponentesCsv(dataInicio: string, dataFim: string): Observable<Blob> {
    const url = `${this.baseUrl}/export-componentes-csv/`;
    const params = new HttpParams()
      .set('data_inicio', dataInicio)
      .set('data_fim', dataFim);
    return this.http.get(url, { params, responseType: 'blob' });
  }
}