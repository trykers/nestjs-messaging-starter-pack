import { Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { REDIS_DOMAIN_NAME, REDIS_PORT_NUMBER, REDIS_PROVIDE_TOKEN, REDIS_PASS } from './redis.constants'
import * as Redis from 'ioredis'

@Injectable()
export class RedisService extends RedisPubSub {
    constructor() {
        const options = {
            password: REDIS_PASS,
            host: REDIS_DOMAIN_NAME,
            port: REDIS_PORT_NUMBER,
            retry_strategy: options => {
                // reconnect after
                return Math.max(options.attempt * 100, 3000);
            }
        }

        super({
            publisher: new Redis(options),
            subscriber: new Redis(options),
        })
    }
}
