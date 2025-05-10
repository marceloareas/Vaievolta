export default interface Emprestimo {
  nome: string;
  item: string;
  tomador: string;
  dataDevolucao: string;
  descricao: string;
  foto?: File | null;
}