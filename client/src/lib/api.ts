// Auto-detect API base URL based on environment
export const API_BASE = import.meta.env.VITE_API_BASE || 
  (typeof window !== 'undefined' ? window.location.origin : '');

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers: { 
      "Content-Type": "application/json", 
      ...(init?.headers || {}) 
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: any, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: "include",
    ...init,
    headers: { 
      "Content-Type": "application/json", 
      ...(init?.headers || {}) 
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}