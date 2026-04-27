export function getUserFirstName(nome: string): string | null {
  const firstName = nome.split(" ")[0];
  if (firstName.length > 6) {
    return firstName.substring(0, 6) + "...";
  }
  return firstName;
}

export function buildImageUrl(apiBase: string, path: string): string {
  const token = localStorage.getItem("token") ?? "";
  return `${apiBase}${path}?token=${encodeURIComponent(token)}`;
}
