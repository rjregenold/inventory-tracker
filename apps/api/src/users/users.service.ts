import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {UserDto} from '../auth/dto/user.dto';
import {AuthMapper} from '../auth/auth.mapper';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async allByRole(roleName: string): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            role: {
              name: roleName,
            },
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    return (users || []).map(AuthMapper.toUserDto);
  }
}
