export const fetchEmprestimos = async () => {
  const res = await fetch("http://localhost:8000/emprestimos/");
  if (!res.ok) throw new Error("Erro ao buscar empréstimos");
  return res.json();
};

export const createEmprestimo = async (emprestimo: any) => {
  const res = await fetch("http://localhost:8000/emprestimos/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emprestimo),
  });
  if (!res.ok) throw new Error("Erro ao cadastrar empréstimo");
  return res.json();
};