import { withClientState } from 'apollo-link-state';

export const local = withClientState({
  Query: {
    vote: (_, __, { cache }) => {
      console.log(cache);
    },
    locales: () => ({
      availableLocales: ['en-Us', 'th-TH'],
      currentLocale: 'en-US',
    }),
  },
  Mutation: {
    setLocale(locale: string) {
      console.log(locale);
    },
    upVote: (_, { id }, { cache }) => {
      id = `ListItem:${id}`;
    },
    downVote: (_, { id }, { cache }) => {
      console.log('downVote');
    },
  },
});
