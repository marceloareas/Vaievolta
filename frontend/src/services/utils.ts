export function getUserFirstName(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nomeCompleto = payload.nome || "";
    return nomeCompleto.split(" ")[0]; // Pega o primeiro nome
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}