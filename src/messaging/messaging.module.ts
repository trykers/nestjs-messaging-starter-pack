import { Module } from '@nestjs/common'
import { MessagingService } from './messaging.service'
import { DatabaseModule } from '../database/database.module'
import { MessagingResolver } from './messaging.resolver'
import { MessagingProvider } from './messaging.providers'
import { UserModule } from 'src/user/user.module'
import { RedisModule } from 'src/redis/redis.module'

@Module({
  imports: [DatabaseModule, RedisModule, UserModule],
  providers: [MessagingService, MessagingResolver, ...MessagingProvider],
})
export class MessagingModule {}
