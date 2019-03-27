import { Module, forwardRef } from '@nestjs/common';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],  // fowardRef => Circular dependency...
  providers: [UserResolver, UserService, ...userProviders],
  exports: [UserService],
  
})
export class UserModule {}
