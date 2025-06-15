import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  // in a real application, we would throttle this endpoint to limit abuse
  async createVerificationToken(
    @Body()
    {identifier}: {identifier: string},
  ): Promise<void> {
    await this.authService.createVerificationToken(identifier, new Date());
  }

  @Post('session')
  async createSession(
    @Body() {identifier, token}: {identifier: string; token: string},
  ): Promise<{token: string} | null> {
    const now = new Date();
    const verificationToken = await this.authService.useVerificationToken(
      identifier,
      token,
      now,
    );
    if (!verificationToken) throw new NotFoundException();
    return await this.authService.generateJwtForUser(
      verificationToken.identifier,
      now,
    );
  }
}
