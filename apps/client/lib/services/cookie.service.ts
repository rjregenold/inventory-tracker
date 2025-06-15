import {getCookie, setCookie, deleteCookie} from 'cookies-next';

export namespace CookieService {
  export function set(name: string, val: string) {
    setCookie(name, val);
  }

  export function get(name: string): string | null {
    const val = getCookie(name);
    return val?.[0] ?? null;
  }

  export function remove(name: string) {
    deleteCookie(name);
  }
}
