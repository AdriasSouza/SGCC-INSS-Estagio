import { Observable } from "rxjs";
import { RequisicaoPaginada } from "../model/requisicao-paginada";
import { RespostaPaginada } from "../model/resposta-paginada";
import { Equipamento } from "../model/equipamento.model";

export interface IService<T> {
    apiUrl: string;
    get(termoBusca?: string | undefined, paginacao?: RequisicaoPaginada | undefined): Observable<Equipamento[]>;
    getById(id: number): Observable<T>;
    save(objeto: T): Observable<T>;
    delete(id: number): Observable<void>;
}
