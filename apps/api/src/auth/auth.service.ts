import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {UserDto} from './dto/user.dto';
import {Prisma} from '@prisma/client';
import {randomBytes, verify} from 'crypto';
import {addMinutes} from 'date-fns';
import crypto from 'crypto';
import {JwtService} from '@nestjs/jwt';
import {AuthMapper} from './auth.mapper';
import {TokenDto} from './dto/token.dto';

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
  ) {}

  async createVerificationToken(
    identifier: string,
    now: Date,
  ): Promise<Prisma.VerificationTokenGetPayload<{}>> {
    const token = generateOTP();
    const expires = addMinutes(now, 10);
    Logger.log(token);
    return this.prisma.verificationToken.create({
      data: {identifier, token: hashToken(token), expires},
    });
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
      Logger.log(verificationToken);
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

    // in a real application, we would just pass back the user id and
    // expose a /user/me endpoint to get all the user details so they
    // could be saved on the client without having to pass a huge jwt
    // back and forth.
    return AuthMapper.toTokenDto(
      await this.jwtService.signAsync(AuthMapper.toUserDto(user)),
    );
  }
}
