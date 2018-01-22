import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { IntlProvider } from 'react-intl';
import * as INTLQUERY from './IntlQuery.gql';
import * as LOCALEQUERY from './LocaleQuery.gql';
import * as SETLOCALEMUTATION from './SetLocaleMutation.gql';

export interface IntlQuery {
  intl: Array<{
    id: string;
    message: string;
  }>;
}

export  interface LocaleQuery {
  locale: string;
  initialNow: number;
  availableLocales: string[];
}

export function getIntlContext(cache: InMemoryCache) {
  const { locale, initialNow } = cache.readQuery<LocaleQuery>({ query: LOCALEQUERY });
  const { intl } = cache.readQuery<IntlQuery>({
    query: INTLQUERY,
    variables: { locale },
  });

  const messages = intl.reduce((msgs, msg) => {
    msgs[msg.id] = msg.message;
    return msgs;
  }, {});

  const provider = new IntlProvider({
    initialNow,
    locale,
    messages,
    defaultLocale: 'en-US',
  });

  return provider.getChildContext().intl;
}

export function setLocale(client: ApolloClient<any>) {
  client.watchQuery<LocaleQuery>({ query: LOCALEQUERY }).subscribe({
    next: ({ data }) => {
      const { locale } = data;
      client.mutate({ mutation: SETLOCALEMUTATION, variables: { locale } });
    },
  });
}

export const state = {
  Query: {
    locale: () => 'en-US',
    initialNow: () => Date.now(),
  },
  Mutation: {
    setLocale(result, variables, { cache }: { cache: InMemoryCache }) {
      const { locale } = variables;
      const { availableLocales, initialNow } = cache.readQuery<LocaleQuery>({ query: LOCALEQUERY });

      cache.writeQuery({ query: LOCALEQUERY, variables, data: { locale, initialNow, availableLocales } });

      if (process.env.BROWSER) {
        const maxAge = 3650 * 24 * 3600; // 10 years in seconds
        document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
      }

      return null;
    },
  },
};
