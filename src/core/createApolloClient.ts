import ApolloClient from 'apollo-client';

export default function createApolloClient(options?) {
  return new ApolloClient(Object.assign({
    dataIdFromObject: (result) => {
      if (result._id) {
        return `${result.__typename}.${result._id}`;
      } else if (result.id) {
        return `${result.__typename}.${result.id}`;
      } else if (result.__typename === 'CourseTableSection') {
        return `${result.course._id}.${result.section._id}`;
      } else if (/Page/.test(result.__typename)) {
        return null;
      } else if (/Edges/.test(result.__typename)) {
        return `${result.__typename}.${result.node._id}`;
      }
      // console.log('NO ID from ', result);
      return null;
    },
    queryDeduplication: true,
    reduxRootSelector: (state) => state.apollo,
    shouldBatch: true,
  }, options));
}
