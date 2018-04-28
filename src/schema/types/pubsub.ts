import { PubSub } from 'graphql-subscriptions';

export const MESSAGE_ADDED = 'message_added';

export const pubsub = new PubSub({
  // connection: {
  //   host: redis.host,
  //   port: redis.port,
  //   retry_strategy: (options) => Math.max(options.attempt * 100, 3000),
  // },
});
