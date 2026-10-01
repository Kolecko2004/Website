// Volání API administrace (/api/admin/*)

async function request(path, options = {}) {
  const res = await fetch(`/api/admin/${path}`, {
    credentials: "same-origin",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `Chyba serveru (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const getSession = () => request("session");

export const login = (username, password) =>
  request("login", { method: "POST", body: JSON.stringify({ username, password }) });

export const logout = () => request("logout", { method: "POST" });

export const getContent = () => request("content");

export const saveContent = (overrides) =>
  request("content", { method: "PUT", body: JSON.stringify(overrides) });
