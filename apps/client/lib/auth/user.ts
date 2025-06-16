import {fromUnixTime, isFuture} from 'date-fns';

export interface User {
  userId: string;
  email: string;
  roles: Array<{
    name: string;
    permissions: Array<{
      action: string;
      resource: string;
    }>;
  }>;
}

export namespace User {
  export function isTokenActive(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return isFuture(fromUnixTime(payload.exp));
  }

  export function fromToken(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
