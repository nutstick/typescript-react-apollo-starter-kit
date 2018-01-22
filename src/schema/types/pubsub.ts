import { RedisPubSub } from 'graphql-redis-subscriptions';
import { redis } from '../../config';

export const MESSAGE_ADDED = 'message_added';

export const pubsub = new RedisPubSub({
  connection: {
    host: redis.host,
    port: redis.port,
    retry_strategy: (options) => Math.max(options.attempt * 100, 3000),
  },
});
