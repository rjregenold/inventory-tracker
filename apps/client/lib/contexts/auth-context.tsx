'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {AuthService} from '@/lib/services/auth.service';
import {User} from '../auth/user';

interface AuthContextType {
  user: User | null;
  signIn: (token: string) => void;
  signOut: () => void;
  redirectSignIn: () => void;
  hasPermission: (action: string, resource: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = AuthService.getJwt();
    if (token) {
      if (User.isTokenActive(token)) {
        setUser(User.fromToken(token));
        AuthService.setAuthToken(token);
      } else {
        AuthService.clearJwt();
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = (token: string) => {
    AuthService.saveJwt(token);
    setUser(User.fromToken(token));
    AuthService.setAuthToken(token);
  };

  const signOut = () => {
    AuthService.clearJwt();
    setUser(null);
    router.push('/');
  };

  const redirectSignIn = () => {
    router.push(AuthService.SIGN_IN_ROUTE);
  };

  const hasPermission = (action: string, resource: string): boolean => {
    if (!user) return false;

    return user.roles.some((role) =>
      role.permissions.some(
        (permission) =>
          permission.action === action && permission.resource === resource,
      ),
    );
  };

  return (
    <AuthContext.Provider
      value={{user, signIn, signOut, redirectSignIn, hasPermission, isLoading}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
