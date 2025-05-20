export const fetchEmprestimos = async () => {
  const token = localStorage.getItem("token");
  // console.log("Token:", token);
  const res = await fetch("http://localhost:8000/emprestimos/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Erro ao buscar empréstimos");
  return res.json();
};

export const createEmprestimo = async (emprestimo: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8000/emprestimos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(emprestimo),
  });

  if (!res.ok) throw new Error("Erro ao cadastrar empréstimo");
  return res.json();
};

