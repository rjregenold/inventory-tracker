import {Prisma} from '@prisma/client';
import {PermissionDto, RoleDto, UserDto} from './dto/user.dto';
import {TokenDto} from './dto/token.dto';

type UserWithPermissions = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: {
          include: {
            permissions: true;
          };
        };
      };
    };
  };
}>;

function toPermissionDto(
  permission: Prisma.PermissionGetPayload<{}>,
): PermissionDto {
  return {
    resource: permission.resource,
    action: permission.action,
  };
}

function toRoleDto(
  role: Prisma.RoleGetPayload<{include: {permissions: true}}>,
): RoleDto {
  return {
    name: role.name,
    permissions: role.permissions.map(toPermissionDto),
  };
}

export namespace AuthMapper {
  export function toTokenDto(token: string): TokenDto {
    return {token};
  }

  export function toUserDto(user: UserWithPermissions): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.userRoles.flatMap((x) => toRoleDto(x.role)),
    };
  }
}
