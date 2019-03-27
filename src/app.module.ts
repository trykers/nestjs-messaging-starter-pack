import { Module, UnauthorizedException, DynamicModule } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { UserModule } from './user/user.module'
import { MessagingModule } from './messaging/messaging.module'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { RedisModule } from './redis/redis.module'
import { AppService } from './app.service'
import { GqlConfigService } from './graph-ql/gql-config.service'
import { GqlConfigModule } from './graph-ql/gql-config.module'

@Module({
  providers: [AppService]
})

export class AppModule {
  static dynamic(): DynamicModule {
    return {
      module: AppModule,
      imports : [
        DatabaseModule,
        GraphQLModule.forRootAsync({
          imports: [GqlConfigModule],
          useExisting: GqlConfigService,
        }),
        AuthModule,
        UserModule,
        MessagingModule,
        RedisModule,
      ]
    }
  }
}
