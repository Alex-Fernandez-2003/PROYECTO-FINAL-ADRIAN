export const API_BASE = "https://6876f512dba809d901ed84d4.mockapi.io/JsonInvitados";
export const RESOURCE = "person";
export const API_URL = `${API_BASE}/${RESOURCE}`;

export async function updatePerson(id: string, patch: Record<string, any>) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update person: ${res.status}`);
  return res.json();
}
