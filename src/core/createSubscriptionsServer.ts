import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { Schema } from '../schema/types/Schema';

export function createSubscriptionServer(socketOpts = {}) {
  return SubscriptionServer.create({
    schema: Schema,
    execute,
    subscribe,
    // async onConnect(connectionParams, webSocket) {
    //   // stuff to create a context for subscriptions like logged in user
    //   return context;
    // },
  }, {
      ...socketOpts,
      path: '/subscriptions',
    },
  );
}
