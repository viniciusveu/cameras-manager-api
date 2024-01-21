import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findByName(name);
    if (!user) throw new NotFoundException()

    if (user.password !== pass) {
      throw new UnauthorizedException();
    }

    delete user.password;
    const access_token = this.jwtService.sign({ user });

    return { access_token };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);

      return await this.usersService.findById(payload.result.id);
    } catch (error) {
      console.log(error)
      return null;
    }
  }
}
