export default interface Emprestimo {
  id?: number;
  nome: string;
  item: string;
  tomador: string;
  descricao: string;
  data_emprestimo?: string;
  data_devolucao_esperada: string;
  data_devolucao_real?: string;
  status?: string;
  foto_url?: string;
}