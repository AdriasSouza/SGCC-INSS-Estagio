export type RespostaPaginada<T> = {
  content: import("d:/Trabalho/Repositorios/SGCC-INSS-Estagio/sgccapp/src/app/model/solicitacao.model").Solicitacao[];
  total: number;            // Total de itens
  page: number;            // Número da página atual
  pageSize: number;        // Tamanho da página
  results: T[];            // Array de itens do tipo T
}
