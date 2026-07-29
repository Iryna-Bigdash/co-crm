export function getApiOrigin(): string {
  const url = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, '');
  if (url) {
    return url;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_API_URL or API_URL is required in production');
  }

  return 'http://127.0.0.1:3000';
}

export function getAuthRequestTimeoutMs(): number {
  const fromEnv = Number(process.env.AUTH_REQUEST_TIMEOUT_MS);
  if (Number.isFinite(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }

  return process.env.NODE_ENV === 'production' ? 120_000 : 8_000;
}

export function getApiBaseUrl(): string {
  return `${getApiOrigin()}/api`;
}

export function getApiHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    ...(extra as Record<string, string>),
  };

  const token = process.env.NEXT_PUBLIC_PROJECT_TOKEN;
  if (token) {
    headers['x-api-key'] = token;
  }

  return headers;
}

export function withApiAuth(init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      ...getApiHeaders(),
      ...(init?.headers || {}),
    },
  };
}
