import { Module } from '@nestjs/common';
//import { RedisProviders } from './redis.providers'
import { RedisService } from './redis.service';

@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
