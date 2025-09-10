const DEFAULT_EXTERNAL_APIS = [
  "https://wph-024-api-todolist-at4ht2551-bisniscreatives-projects.vercel.app",
  "https://wph-024-api-todolist.vercel.app",
];

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
  const rawBases =
    (import.meta as any).env?.VITE_API_BASES ||
    (import.meta as any).env?.VITE_API_BASE ||
    "";
  const envBases = String(rawBases)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const candidates: string[] = [];

  if (isAbsolute) {
    candidates.push(input);
  } else {
    for (const b of envBases) candidates.push(joinUrl(b, input));
    candidates.push(input);
    candidates.push(input.startsWith("/api") ? input : `/api${input}`);
    for (const b of DEFAULT_EXTERNAL_APIS) candidates.push(joinUrl(b, input));
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
