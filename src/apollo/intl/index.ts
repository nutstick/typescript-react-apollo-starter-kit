import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { IntlProvider } from 'react-intl';
import * as IntlQuery from './IntlQuery.gql';
import * as LocaleQuery from './LocaleQuery.gql';
import * as SETLOCALEMUTATION from './SetLocaleMutation.gql';

export function getIntlContext(cache: InMemoryCache) {
  const { locale, initialNow } = cache.readQuery<LocaleQuery.Query>({ query: LocaleQuery });
  const { intl } = cache.readQuery<IntlQuery.Query>({
    query: IntlQuery,
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

export const state = {
  defaults: {
    locale: 'en-US',
    initialNow: Date.now(),
    // availableLocales: [],
  },
  Mutation: {
    setLocale(result, variables, { cache }: { cache: InMemoryCache }) {
      const { locale } = variables;
      const { availableLocales, initialNow } = cache.readQuery<LocaleQuery.Query>({ query: LocaleQuery });

      cache.writeQuery({ query: LocaleQuery, variables, data: { locale, initialNow, availableLocales } });

      if (process.env.BROWSER) {
        const maxAge = 3650 * 24 * 3600; // 10 years in seconds
        document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
      }

      return {
        locale,
        __typename: 'SetLocalePayload',
      };
    },
  },
};
