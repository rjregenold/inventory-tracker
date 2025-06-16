import {ApiError} from '../api/client';
import {authApi} from '../api/auth.api';
import {Result} from '../types/result';
import {CookieService} from './cookie.service';
import {LocalStorageService} from './localStorage.service';

interface ApiToken {
  token: string;
}

export type AuthTokenCallback = (token: string | null) => void;

export namespace AuthService {
  export const USER_TOKEN_KEY: string = 'auth.token';
  export const SIGN_IN_ROUTE: string = '/auth/sign-in';
  export const ACCESS_DENIED_ROUTE: string = '/access-denied';

  let authToken: string | null = null;

  let authTokenListeners: AuthTokenCallback[] = [];

  export function addAuthTokenListener(
    fn: AuthTokenCallback,
    immediate: boolean = false,
  ) {
    if (immediate) {
      fn(getAuthToken());
    }
    authTokenListeners.push(fn);
  }

  export function removeAuthTokenListener(fn: AuthTokenCallback) {
    authTokenListeners = authTokenListeners.filter((x) => x !== fn);
  }

  function emitAuthToken(token: string | null) {
    authTokenListeners.forEach((fn) => fn(token));
  }

  export function createOtp(
    identifier: string,
  ): Promise<Result<void, ApiError>> {
    return authApi.post<void>('/auth/otp', {
      body: JSON.stringify({identifier}),
    });
  }

  export async function createSession(
    identifier: string,
    token: string,
  ): Promise<Result<string | null, ApiError>> {
    const res = await authApi.post<ApiToken | null>('/auth/session', {
      body: JSON.stringify({identifier, token}),
    });
    return Result.map(res, (x) => x?.token ?? null);
  }

  export async function refreshToken(): Promise<
    Result<string | null, ApiError>
  > {
    const res = await authApi.put<ApiToken | null>('/auth/token', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return Result.map(res, (x) => x?.token ?? null);
  }

  export function setAuthToken(jwt: string | null) {
    authToken = jwt;
    emitAuthToken(jwt);
  }

  export function getAuthToken(): string | null {
    return authToken;
  }

  export function saveJwt(jwt: string) {
    LocalStorageService.setItem(USER_TOKEN_KEY, jwt);
    CookieService.set(USER_TOKEN_KEY, jwt);
  }

  export function getJwt(): string | null {
    return LocalStorageService.getItem(USER_TOKEN_KEY);
  }

  export function clearJwt() {
    LocalStorageService.removeItem(USER_TOKEN_KEY);
    CookieService.remove(USER_TOKEN_KEY);
  }
}
