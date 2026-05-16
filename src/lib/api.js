import { API } from '@/config';

export async function apiFetch(path, options = {}) {
  if (!API) throw new Error('Falta NEXT_PUBLIC_API_URL');

  const headers = { ...(options.headers) || {} };

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  console.log("URL completa de la petición:", `${API}`);

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);


  if (!res.ok) {
    const err = new Error(data?.error || `Error HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  
  return data;
}