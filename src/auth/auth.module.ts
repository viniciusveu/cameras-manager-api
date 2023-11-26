import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; 
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '2h' }
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [PassportModule, AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
