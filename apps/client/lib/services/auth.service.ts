import {ApiError} from '../api/client';
import {inventoryApi} from '../api/inventory';
import {Result} from '../types/result';
import {CookieService} from './cookie.service';
import {LocalStorageService} from './localStorage.service';

interface ApiToken {
  token: string;
}

export namespace AuthService {
  export const USER_TOKEN_KEY: string = 'auth.token';

  export function createOtp(
    identifier: string,
  ): Promise<Result<void, ApiError>> {
    return inventoryApi.post<void>('/auth/otp', {
      body: JSON.stringify({identifier}),
    });
  }

  export async function createSession(
    identifier: string,
    token: string,
  ): Promise<Result<string | null, ApiError>> {
    const res = await inventoryApi.post<ApiToken | null>('/auth/session', {
      body: JSON.stringify({identifier, token}),
    });
    return Result.map(res, (x) => x?.token ?? null);
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
