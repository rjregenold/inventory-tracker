export class PermissionDto {
  action: string;
  resource: string;
}

export class UserDto {
  id: string;
  email: string;
  name: string;
  permissions: PermissionDto[];
}
