import { Module } from '@nestjs/common';
import { GqlConfigService } from './gql-config.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [GqlConfigService],
  exports: [GqlConfigService] 
})
export class GqlConfigModule {}
