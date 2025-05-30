export function getUserFirstName(nome : string): string | null {
  return nome.split(" ")[0]; // Pega o primeiro nome
}