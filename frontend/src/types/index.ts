export default interface Emprestimo {
  id?: number;
  nome: string;
  item: string;
  tomador: string;
  nome_pessoa?: string;
  pessoa_id?: number;
  descricao: string;
  data_emprestimo?: string;
  data_devolucao_esperada: string;
  data_devolucao_real?: string;
  status?: string;
  foto_url?: string;
}