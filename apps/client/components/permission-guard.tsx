'use client';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useAuth} from '@/lib/contexts/auth-context';

interface PermissionGuardProps {
  action: string;
  resource: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  action,
  resource,
  children,
  fallback,
}: PermissionGuardProps) {
  const {user, redirectSignIn, hasPermission, isLoading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      redirectSignIn();
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <></>;
  }

  if (!hasPermission(action, resource)) {
    return (
      <>
        {fallback || (
          <div>
            <h1 className="text-2xl font-bold mb-4">Forbidden</h1>
            <p>You don't have access to this resource.</p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
