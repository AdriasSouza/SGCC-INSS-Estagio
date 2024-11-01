// IService.ts
import { Observable } from 'rxjs';
import { RequisicaoPaginada } from '../model/requisicao-paginada';
import { RespostaPaginada } from '../model/resposta-paginada';

export interface IService<T> {
  get(termoBusca?: string, paginacao?: RequisicaoPaginada): Observable<RespostaPaginada<T>>;
  getById(id: number): Observable<T>;
  save(objeto: T): Observable<T>;
  delete(id: number): Observable<void>;
}
