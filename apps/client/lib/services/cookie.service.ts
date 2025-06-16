import Cookies from 'js-cookie';

export namespace CookieService {
  export function set(name: string, val: string) {
    Cookies.set(name, val);
  }

  export function get(name: string): string | null {
    return Cookies.get(name) ?? null;
  }

  export function remove(name: string) {
    Cookies.remove(name);
  }
}
