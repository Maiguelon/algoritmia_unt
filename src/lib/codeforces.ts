const CODEFORCES_ORIGIN = 'https://codeforces.com';

export function codeforcesGymSubmitUrl(problemUrl: string): string | null {
  const url = new URL(problemUrl);
  const gym = /^\/gym\/(\d+)\/problem\/[A-Z][A-Z0-9]*\/?$/.exec(url.pathname);
  return url.origin === CODEFORCES_ORIGIN && gym ? `${CODEFORCES_ORIGIN}/gym/${gym[1]}/submit` : null;
}

export async function findCodeforcesHandle(handle: string): Promise<string | null> {
  const url = new URL('/api/user.info', CODEFORCES_ORIGIN);
  url.search = new URLSearchParams({ handles: handle, checkHistoricHandles: 'false' }).toString();
  const response = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(8000) });
  const data = await response.json() as { status: string; comment?: string; result?: { handle?: string }[] };
  if (response.status === 400 && data.status === 'FAILED' && /^handles: User with handle .+ not found\.?$/i.test(data.comment ?? '')) {
    return null;
  }
  const currentHandle = data.result?.[0]?.handle;
  if (response.ok && data.status === 'OK' && currentHandle?.toLowerCase() === handle.toLowerCase()) {
    return currentHandle;
  }
  throw new Error('Codeforces no pudo confirmar el usuario.');
}
