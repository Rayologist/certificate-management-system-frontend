type HTTPMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'CONNECT'
  | 'TRACE';

type Request = {
  url: string;
  method: HTTPMethods;
  payload?: { [key: string]: any };
  headers?: [string, string][];
  authToken?: string;
  toJson?: boolean;
  timeout?: number;
};

export default async function request({
  url,
  method,
  payload,
  authToken,
  headers,
  toJson = true,
  timeout = 5 * 1000,
}: Request) {
  const _payload = payload ?? {};
  const body = method !== 'GET' ? JSON.stringify(_payload) : null;
  const _headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  if (headers?.length) {
    headers.forEach((header) => {
      const [name, value] = header;
      _headers.append(name, value);
    });
  }

  if (authToken) {
    _headers.append('Authorization', authToken);
  }

  // Request Timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    credentials: 'include',
    method,
    body,
    headers: _headers,
    signal: controller.signal,
  });

  clearTimeout(id);

  if (!toJson) {
    return response;
  }

  return response.json();
}
