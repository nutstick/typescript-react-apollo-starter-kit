import { ApolloCache } from 'apollo-cache';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { getOperationAST } from 'graphql';
import { state as intl } from './intl';
import { state as todo } from './todo';

interface IOptions {
  local: ApolloLink;
  ssrMode?: boolean;
  cache: ApolloCache<any>;
  ssrForceFetchDelay?: number;
  wsEndpoint?: string;
}

export const createApolloClient = ({ local, wsEndpoint, ...options }: IOptions) => {
  const state = withClientState({
    cache: options.cache,
    defaults: {
      ...intl.defaults,
      ...todo.defaults,
    },
    resolvers: {
      Mutation: {
        ...intl.Mutation,
        ...todo.Mutation,
      },
    },
  });

  const link = wsEndpoint ? ApolloLink.split(
    (operation) => {
      const operationAST = getOperationAST(operation.query, operation.operationName);
      return !!operationAST && operationAST.operation === 'subscription';
    },
    new WebSocketLink({
      uri: wsEndpoint,
      options: {
        reconnect: true,
        // connectionParams: {
        //   token: Cookies.get('id_token'),
        // },
      },
    }),
    state.concat(local),
  ) : state.concat(local);

  const client = new ApolloClient({
    ...options,
    link,
  });

  return client;
};
