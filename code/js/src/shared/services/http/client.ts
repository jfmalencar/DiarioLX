type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue }
type JSONArray = Array<JSONValue>;

type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export function post<T>(url: string, body: JSONValue, options: RequestInit = {}, onUnauthorized?: () => void): Promise<ApiResult<T>> {
  return request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }, onUnauthorized);
}

export function get<T>(url: string, options: RequestInit = {}, onUnauthorized?: () => void): Promise<ApiResult<T>> {
  return request<T>(url, { ...options, method: 'GET' }, onUnauthorized);
}

export async function request<T>(url: string, options: RequestInit = {}, onUnauthorized?: () => void): Promise<ApiResult<T>> {
  try {
    const { headers, ...rest } = options;
    const response = await fetch(url, {
      ...rest,
      headers: { 'Content-Type': 'application/json', ...(headers || {}) },
      credentials: 'include',
    });

    if (response.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/problem+json')) {
        const problem = await response.json();
        return { success: false, error: problem.title || `Action failed: ${response.status}` };
      } else {
        const errorText = await response.text();
        return { success: false, error: `Action failed: ${response.status} - ${errorText}` };
      }
    }
    const raw = await response.text();
    try {
      return { success: true, data: JSON.parse(raw) };
    } catch (err) {
      return { success: true, data: raw as unknown as T };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
