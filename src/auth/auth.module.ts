import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { HttpStrategy } from './strategy/http.strategy';
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'myjwt', property: 'user', session: false }),
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_SECRET_KEY || 'gfds54gf56dsg48gfn4gh6541n6bvc=+fdsfdgfgd4512.0',
      signOptions: {
        expiresIn: 3600,
      },
    }),
     // Circular dependency...
    forwardRef(() => UserModule)],
  providers: [AuthService, HttpStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
