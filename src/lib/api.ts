const rawApiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
