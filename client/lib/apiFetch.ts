const DEFAULT_EXTERNAL_API = "https://wph-024-api-todolist.vercel.app";

function joinUrl(base: string, path: string) {
  if (!path) return base;
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export async function apiFetch(input: string, init?: RequestInit) {
  const tryOnce = async (url: string) => {
    const res = await fetch(url, init).catch((e) => {
      throw new Error(
        `Network error: ${e instanceof Error ? e.message : String(e)}`,
      );
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  };

  const isAbsolute = /^(https?:)?\/\//i.test(input);
  const apiBase = (import.meta as any).env?.VITE_API_BASE || "";
  const candidates: string[] = [];

  if (isAbsolute) {
    candidates.push(input);
  } else {
    if (apiBase) candidates.push(joinUrl(apiBase, input));
    candidates.push(input);
    candidates.push(input.startsWith("/api") ? input : `/api${input}`);
    candidates.push(joinUrl(DEFAULT_EXTERNAL_API, input));
  }

  let lastErr: any;
  for (const url of candidates) {
    try {
      return await tryOnce(url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("Request failed");
}
