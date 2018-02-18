import { ApolloCache } from 'apollo-cache';
import { InMemoryCache } from 'apollo-cache-inmemory/lib/inMemoryCache';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { getOperationAST } from 'graphql';
import { state as intl } from './intl';

interface IOptions {
  local: ApolloLink;
  ssrMode?: boolean;
  cache: ApolloCache<any>;
  ssrForceFetchDelay?: number;
  wsEndpoint?: string;
}

export const createApolloClient = ({ local, wsEndpoint, ...options }: IOptions) => {
  const update = (query, updater) => (result, variables, { cache }: { cache: InMemoryCache }) => {
    const data = updater(cache.readQuery({ query, variables }), variables);
    cache.writeQuery({ query, variables, data });
    return null;
  };
  const state = withClientState({
    Query: {
      todos: () => [],
      ...intl.Query,
    },
    Mutation: {
      ...intl.Mutation,
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
