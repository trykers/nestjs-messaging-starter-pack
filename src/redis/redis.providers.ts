import { REDIS_DOMAIN_NAME, REDIS_PORT_NUMBER, REDIS_PROVIDE_TOKEN, REDIS_PASS } from './redis.constants'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import * as Redis from 'ioredis';

const options = {
    password: REDIS_PASS,
    host: REDIS_DOMAIN_NAME,
    port: REDIS_PORT_NUMBER,
    retry_strategy: options => {
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    }
  };

export const RedisProviders = [
    {
        provide: REDIS_PROVIDE_TOKEN,
        useFactory: async (): Promise<RedisPubSub> =>
        new RedisPubSub({
            publisher: new Redis(options),
            subscriber: new Redis(options)
        })
    },
]
