'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {fromUnixTime, isFuture} from 'date-fns';
import {AuthService} from '@/lib/services/auth.service';

interface User {
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

interface AuthContextType {
  user: User | null;
  signIn: (token: string) => void;
  signOut: () => void;
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
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (isFuture(fromUnixTime(payload.exp))) {
          setUser({
            userId: payload.userId,
            email: payload.email,
            roles: payload.roles,
          });
        } else {
          AuthService.clearJwt();
        }
      } catch (error) {
        AuthService.clearJwt();
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = (token: string) => {
    AuthService.saveJwt(token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles,
    });
  };

  const signOut = () => {
    AuthService.clearJwt();
    setUser(null);
    router.push('/');
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
      value={{user, signIn, signOut, hasPermission, isLoading}}
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
