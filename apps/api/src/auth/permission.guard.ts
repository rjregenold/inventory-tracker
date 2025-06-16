import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtPayload} from './jwt.strategy';

export const PERMISSION_KEY = 'permission';
export const Permission = (action: string, resource: string) =>
  SetMetadata(PERMISSION_KEY, {action, resource});

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<{
      action: string;
      resource: string;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const hasPermission = user.roles.some((role) =>
      role.permissions.some(
        (permission) =>
          permission.action === requiredPermission.action &&
          permission.resource === requiredPermission.resource,
      ),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions: ${requiredPermission.action}:${requiredPermission.resource}`,
      );
    }

    return true;
  }
}
