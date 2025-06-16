import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {Prisma} from '@prisma/client';
import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';
import crypto from 'crypto';
import {JwtService} from '@nestjs/jwt';
import {AuthMapper} from './auth.mapper';
import {TokenDto} from './dto/token.dto';
import {
  AuthOtpCreatedEvent,
  AuthSignInEvent,
  EventPublisher,
} from '@gddy-coding-exercise/shared-events';

function generateOTP(length: number = 6): string {
  const pool = '0123456789';
  const poolLength = pool.length;
  const bytes = randomBytes(length);
  return Array.from(bytes)
    .map((x) => pool[x % poolLength])
    .join('');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventPublisher: EventPublisher,
  ) {}

  async createVerificationToken(
    identifier: string,
    now: Date,
  ): Promise<Prisma.VerificationTokenGetPayload<{}>> {
    const token = generateOTP();
    const expires = addMinutes(now, 10);
    const verificationToken = this.prisma.verificationToken.create({
      data: {identifier, token: hashToken(token), expires},
    });

    await this.eventPublisher.publish<AuthOtpCreatedEvent>({
      eventType: 'auth.otp-created',
      data: {
        email: identifier,
        code: token,
        expires: expires,
        createdAt: now,
      },
    });

    return verificationToken;
  }

  async useVerificationToken(
    identifier: string,
    token: string,
    now: Date,
  ): Promise<Prisma.VerificationTokenGetPayload<{}> | null> {
    try {
      const verificationToken = await this.prisma.verificationToken.delete({
        where: {identifier_token: {identifier, token: hashToken(token)}},
      });
      if (verificationToken.expires < now) return null;
      return verificationToken;
    } catch (err) {
      return null;
    }
  }

  async generateJwtForUser(
    identity: string,
    now: Date,
  ): Promise<TokenDto | null> {
    const user = await this.prisma.user.upsert({
      create: {
        email: identity,
        lastLoginAt: now,
      },
      update: {
        lastLoginAt: now,
      },
      where: {email: identity},
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

    await this.eventPublisher.publish<AuthSignInEvent>({
      eventType: 'auth.sign-in',
      data: {
        userId: user.id,
        signedInAt: now,
      },
    });

    // in a real application, we would just pass back the user id and
    // expose a /user/me endpoint to get all the user details so they
    // could be saved on the client without having to pass a huge jwt
    // back and forth.
    return AuthMapper.toTokenDto(
      await this.jwtService.signAsync(AuthMapper.toUserDto(user)),
    );
  }

  // deletes all roles assigned to a user and assigns them the given role
  async assignRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({where: {name: roleName}});
    await this.prisma.userRole.deleteMany({where: {userId}});
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
    });
  }
}
