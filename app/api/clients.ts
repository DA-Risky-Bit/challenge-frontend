import { API } from "~/config";

let csrf: string | null = null;

export const resetCsrf = (): void => {
  csrf = null;
};

interface CsrfResponse {
  token: string;
}

async function loadCsrf(): Promise<void> {
  const r = await fetch(`${API}/api/auth/csrf`, { credentials: 'include' });

  if (!r.ok) {
    throw new Error(`Failed to fetch CSRF token: ${r.status} ${r.statusText}`);
  }

  const data: CsrfResponse = await r.json();
  if (!data.token) {
    throw new Error('CSRF response did not contain a token');
  }

  csrf = data.token;
}

export async function api(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const needsToken = !['GET', 'HEAD'].includes(method);

  if (needsToken && !csrf) {
    await loadCsrf();
  }

  const send = (): Promise<Response> =>
    fetch(`${API}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers),
        ...(needsToken && csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
    });

  let res = await send();

  // Stale token: refresh once and retry
  if (res.status === 403 && needsToken) {
    await loadCsrf();
    res = await send();
  }

  if (res.status === 401) {
    window.dispatchEvent(new Event('session-expired'));
  }

  return res;
}
