const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

export const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};
