import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { RefreshTokensDto } from './models/refreshTokens.dto';
import { RefreshTokensService } from './refreshTokens.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokensService: RefreshTokensService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByUniqueArgs({ email });
    if (user && (await compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User, clientId: string) {
    const accessToken = this.jwtService.sign({ sub: user.email });
    const refreshToken = await this.refreshTokensService.generateNewRefreshTokenAndInvalidateOld(
      user.email,
      clientId,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser({
      email: registerDto.email,
      password: registerDto.password,
    });
    const accessToken = this.generateAccessToken(user.email);
    const refreshToken = await this.refreshTokensService.generateNewRefreshTokenAndInvalidateOld(
      user.email,
      registerDto.clientId,
    );
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokensDto: RefreshTokensDto) {
    try {
      const validJwt = await this.refreshTokensService.validateRefreshToken(
        refreshTokensDto.refreshToken,
      );
      const accessToken = this.generateAccessToken(validJwt.user_email);
      const refreshToken = await this.refreshTokensService.generateNewRefreshTokenAndInvalidateOld(
        validJwt.user_email,
        validJwt.client_id,
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private generateAccessToken(sub: string): string {
    return this.jwtService.sign({ sub });
  }
}
