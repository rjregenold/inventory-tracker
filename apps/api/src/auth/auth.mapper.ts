import {Prisma} from '@prisma/client';
import {PermissionDto, UserDto} from './dto/user.dto';
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

export namespace AuthMapper {
  export function toTokenDto(token: string): TokenDto {
    return {token};
  }

  export function toUserDto(user: UserWithPermissions): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      permissions: user.userRoles.flatMap((x) =>
        x.role.permissions.map(toPermissionDto),
      ),
    };
  }
}
