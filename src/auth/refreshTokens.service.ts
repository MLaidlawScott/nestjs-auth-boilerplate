import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@prisma/client';
import { RefreshTokensRepository } from './refreshTokens.repository';

@Injectable()
export class RefreshTokensService {
  constructor(
    private jwtService: JwtService,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async generateNewRefreshTokenAndInvalidateOld(
    userEmail: string,
    clientId: string,
  ): Promise<string> {
    await this.invalidateRefreshTokens(userEmail, clientId);
    return await this.generateRefreshToken(userEmail, clientId);
  }

  async validateRefreshToken(token: string): Promise<RefreshToken> {
    try {
      this.jwtService.verify(token);
      const persistedJwt = await this.refreshTokensRepository.findRefreshTokenByToken(
        { token },
      );
      if (persistedJwt === null) {
        throw new UnauthorizedException();
      }
      return persistedJwt;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  // Should you be using generateNewRefreshTokenAndInvalidateOld?
  async invalidateRefreshTokens(userEmail: string, clientId: string) {
    return await this.refreshTokensRepository.deleteTokens({
      where: { AND: { client_id: clientId, user_email: userEmail } },
    });
  }

  // Use generateNewRefreshTokenAndInvalidateOld
  private async generateRefreshToken(sub: string, clientId: string) {
    const payload = { sub, clientId };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '300s' });

    try {
      const createTokenInput = {
        client_id: clientId,
        user_email: sub,
        token: refreshToken,
        expires: this.jwtService.decode(refreshToken)['exp'],
      };
      await this.refreshTokensRepository.createRefreshToken(createTokenInput);
    } catch (err) {
      throw new BadRequestException();
    }

    return refreshToken;
  }
}
