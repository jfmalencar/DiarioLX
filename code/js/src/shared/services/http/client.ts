import { useCallback } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

type JSONValue = string | number | boolean | null | JSONObject | JSONArray | undefined;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = Array<JSONValue> | JSONValue[];

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(refreshUri: string): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(refreshUri, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  onUnauthorized?: () => void,
  refreshUri?: string,
): Promise<ApiResult<T>> {
  try {
    const { headers, ...rest } = options;
    const isUpload = rest.body instanceof FormData;
    const response = await fetch(url, {
      ...rest,
      headers: isUpload ? { ...(headers || {}) } : { 'Content-Type': 'application/json', ...(headers || {}) },
      credentials: 'include',
    });

    if (response.status === 401) {
      if (refreshUri) {
        const refreshed = await refreshToken(refreshUri);
        if (refreshed) {
          return request<T>(url, options, onUnauthorized);
        } else {
          onUnauthorized?.();
          return { success: false, error: 'Session expired' };
        }
      } else {
        onUnauthorized?.();
        return { success: false, error: 'Unauthorized' };
      }
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/problem+json')) {
        const problem = await response.json();
        return { success: false, error: problem.detail || `Action failed: ${response.status}` };
      } else {
        const errorText = await response.text();
        return { success: false, error: `Action failed: ${response.status} - ${errorText}` };
      }
    }

    const raw = await response.text();
    if (!raw) {
      return { success: true, data: undefined as T };
    }
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return { success: true, data: JSON.parse(raw) as T };
    }
    return { success: true, data: raw as T };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export function useApi() {
  const { endpoints } = useBootstrap();
  const refreshUri = endpoints.auth.refresh.href;

  const onUnauthorized = useCallback(() => {
  }, []);

  const get = useCallback(
    <T>(url: string, options: RequestInit = {}) =>
      request<T>(url, { ...options, method: 'GET' }, onUnauthorized, refreshUri),
    [onUnauthorized, refreshUri],
  );

  const post = useCallback(
    <T>(url: string, body: JSONValue, options: RequestInit = {}) =>
      request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }, onUnauthorized, refreshUri),
    [onUnauthorized, refreshUri],
  );

  const put = useCallback(
    <T>(url: string, body: JSONValue, options: RequestInit = {}) =>
      request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }, onUnauthorized, refreshUri),
    [onUnauthorized, refreshUri],
  );

  const patch = useCallback(
    <T>(url: string, body: JSONValue, options: RequestInit = {}) =>
      request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }, onUnauthorized, refreshUri),
    [onUnauthorized, refreshUri],
  );

  const remove = useCallback(
    <T>(url: string, options: RequestInit = {}) =>
      request<T>(url, { ...options, method: 'DELETE' }, onUnauthorized, refreshUri),
    [onUnauthorized, refreshUri],
  );

  const upload = useCallback(
    <T>(url: string, formData: FormData, options: RequestInit = {}) =>
      request<T>(url, { ...options, method: 'POST', body: formData }, onUnauthorized, refreshUri),
    [onUnauthorized, refreshUri],
  );

  return { get, post, put, patch, remove, upload };
}