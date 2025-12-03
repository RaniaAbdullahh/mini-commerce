// lib/api.ts
export const CATALOG_API = process.env.NEXT_PUBLIC_CATALOG_API_URL!;
export const SALES_API = process.env.NEXT_PUBLIC_SALES_API_URL!;

export async function apiGet(path: string) {
  const res = await fetch(`${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiPost(path: string, body: any) {
  const res = await fetch(`${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${path} failed: ${txt}`);
  }
  return res.json();
}
