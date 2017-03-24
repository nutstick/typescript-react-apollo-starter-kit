import ApolloClient from 'apollo-client';

export default function createApolloClient(options?) {
  return new ApolloClient(Object.assign({}, {
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
        return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
      }
      return null;
    },
    queryDeduplication: true,
    reduxRootSelector: (state) => state.apollo,
    // shouldBatch: true,
  }, options));
}
