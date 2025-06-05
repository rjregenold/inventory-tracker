import {err, ok, Result} from '../types/result';

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string, defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Result<T, ApiError>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const res = await fetch(url, config);

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = {message: res.statusText};
        }

        return err({
          message: errorData.message || `HTTP ${res.status}`,
          status: res.status,
          data: errorData,
        });
      }

      if (res.status === 204) {
        return ok({} as T);
      }

      return ok(await res.json());
    } catch (e) {
      console.error('request failed', url, e);
      return err({
        message: 'Network error or server unavailable',
        status: 0,
        data: {originalError: e},
      });
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<Result<T, ApiError>> {
    return this.request<T>(endpoint, {...options, method: 'GET'});
  }

  // TODO: implement additional verbs
}
