export const DEFAULT_EXTERNAL_API = "https://wph-024-api-todolist.vercel.app";

export function getExternalApiBase(): string | null {
  const env = process.env.EXTERNAL_API_BASE || process.env.VITE_API_BASE || "";
  const base = env.trim() || DEFAULT_EXTERNAL_API;
  try {
    // Basic validation
    const u = new URL(base.startsWith("http") ? base : `https://${base}`);
    return u.origin + (u.pathname.endsWith("/") ? u.pathname.slice(0, -1) : u.pathname);
  } catch {
    return DEFAULT_EXTERNAL_API;
  }
}
