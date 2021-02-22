import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { RegisterDto } from './models/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByUniqueArgs({ email });
    // hash password here
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser({
      email: registerDto.email,
      password: registerDto.password,
    });
    const accessToken = await this.generateAccessToken(user.email);
    const refreshToken = await this.generateRefreshToken(
      user.email,
      registerDto.clientId,
    );
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // sub will be the unique user id
  async generateAccessToken(sub: string): Promise<string> {
    return this.jwtService.sign({ sub });
  }

  async generateRefreshToken(sub: string, clientId: string) {
    // generate token
    const payload = { sub, clientId };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    // persist token in database
    // only if we successfully persist the token should be return it

    // NEED TO IMPLEMENT PERSISTENCE FIRST, THIS IS JUST FOR TESTING
    return refreshToken;
  }
}
