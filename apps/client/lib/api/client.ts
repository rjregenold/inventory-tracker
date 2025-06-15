import {Result} from '../types/result';

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export class ApiError {
  static toString(err: ApiError): string {
    return `API Error: ${err.message}`;
  }
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

        return Result.err({
          message: errorData.message || `HTTP ${res.status}`,
          status: res.status,
          data: errorData,
        });
      }

      if (res.status === 204) {
        return Result.ok({} as T);
      }

      return Result.ok(await res.json());
    } catch (e) {
      console.error('request failed', url, e);
      return Result.err({
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

  async post<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<Result<T, ApiError>> {
    return this.request<T>(endpoint, {...options, method: 'POST'});
  }

  // TODO: implement additional verbs
}
