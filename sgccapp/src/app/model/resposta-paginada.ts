export interface RespostaPaginada<T> {
  total: number;            // Total de itens
  page: number;            // Número da página atual
  pageSize: number;        // Tamanho da página
  results: T[];            // Array de itens do tipo T
}
