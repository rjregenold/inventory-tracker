import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {AuthService} from './lib/services/auth.service';
import {fromUnixTime, isPast} from 'date-fns';

const signInRoute = '/auth/sign-in';
const publicRoutes = [signInRoute, '/'];

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get(AuthService.USER_TOKEN_KEY)?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const {pathname} = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL(signInRoute, request.url));
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (isPast(fromUnixTime(payload.exp))) {
      return NextResponse.redirect(new URL(signInRoute, request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL(signInRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
