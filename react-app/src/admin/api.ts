// Thin fetch wrapper for the admin API. Same-origin so the httpOnly auth
// cookie is sent automatically; errors surface the server's { error } message.

export type ApiError = Error & { status: number };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body */
    }
    const err = new Error(message) as ApiError;
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

// Multipart upload — do NOT set Content-Type so the browser adds the correct
// multipart boundary. Returns the parsed JSON ({ url } for image uploads).
export async function apiUpload<T>(path: string, file: File, field = "image"): Promise<T> {
  const form = new FormData();
  form.append(field, file);
  const res = await fetch(`/api${path}`, {
    method: "POST",
    credentials: "same-origin",
    body: form,
  });
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body */
    }
    const err = new Error(message) as ApiError;
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

export const apiGet = <T>(path: string) => request<T>(path);
export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
export const apiPut = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
export const apiDelete = <T>(path: string) =>
  request<T>(path, { method: "DELETE" });
