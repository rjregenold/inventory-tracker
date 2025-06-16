import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {User} from './user';
import {AuthService} from '@/lib/services/auth.service';

export function requireAuth(): User {
  const cookieStore = cookies();
  const token = cookieStore.get(AuthService.USER_TOKEN_KEY)?.value;

  if (!token || !User.isTokenActive(token)) {
    redirect(AuthService.SIGN_IN_ROUTE);
  }

  AuthService.setAuthToken(token);
  return User.fromToken(token);
}

export function requirePermission(action: string, resource: string) {
  const user = requireAuth();

  const hasPermission = user.roles?.some((role) =>
    role.permissions?.some(
      (p) => p.action === action && p.resource === resource,
    ),
  );

  if (!hasPermission) {
    redirect(AuthService.ACCESS_DENIED_ROUTE);
  }

  return user;
}
