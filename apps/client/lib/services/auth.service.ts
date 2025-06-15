import {ApiError} from '../api/client';
import {inventoryApi} from '../api/inventory';
import {Result} from '../types/result';
import {LocalStorageService} from './localStorage.service';

const USER_TOKEN_KEY: string = 'auth.token';

interface ApiToken {
  token: string;
}

export namespace AuthService {
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
  }

  export function getJwt(): string | null {
    return LocalStorageService.getItem(USER_TOKEN_KEY);
  }
}
