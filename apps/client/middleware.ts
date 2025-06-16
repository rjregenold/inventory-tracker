import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {AuthService} from './lib/services/auth.service';
import {cookies} from 'next/headers';
import {User} from './lib/auth/user';

const publicRoutes = [AuthService.SIGN_IN_ROUTE, '/'];

export function middleware(request: NextRequest) {
  const token = cookies().get(AuthService.USER_TOKEN_KEY)?.value;

  const {pathname} = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token || !User.isTokenActive(token)) {
    return NextResponse.redirect(
      new URL(AuthService.SIGN_IN_ROUTE, request.url),
    );
  }

  AuthService.setAuthToken(token);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
