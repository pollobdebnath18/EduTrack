const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    // Mimicking axios error structure for seamless drop-in replacement
    throw { response: { data } };
  }
  
  return { data };
}

const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),
  post: (endpoint: string, body?: any) => fetchWithAuth(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: (endpoint: string, body?: any) => fetchWithAuth(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
};

export default api;
