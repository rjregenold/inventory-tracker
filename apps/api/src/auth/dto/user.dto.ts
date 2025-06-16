export class PermissionDto {
  action: string;
  resource: string;
}

export class RoleDto {
  name: string;
  permissions: PermissionDto[];
}

export class UserDto {
  id: string;
  email: string;
  name: string;
  roles: RoleDto[];
}
