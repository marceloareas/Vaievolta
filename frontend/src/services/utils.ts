export function getUserFirstName(nome: string): string | null {
  const firstName = nome.split(" ")[0];
  if (firstName.length > 6) {
    return firstName.substring(0, 6) + "...";
  }
  return firstName;
}

export async function fetchImageAsObjectUrl(
  apiBase: string,
  path: string,
): Promise<string> {
  const token = localStorage.getItem("token") ?? "";
  const response = await fetch(`${apiBase}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return "";
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
