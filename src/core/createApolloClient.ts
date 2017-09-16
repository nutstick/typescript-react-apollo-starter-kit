import ApolloClient from 'apollo-client';

export default function createApolloClient(options?) {
  return new ApolloClient({
    // dataIdFromObject(result) {
    //   const x: any = result;
    //   if (x._id) {
    //     return `${x.__typename}.${x._id}`;
    //   } else if (x.id) {
    //     return `${x.__typename}.${x.id}`;
    //   } else if (x.__typename === 'CourseTableSection') {
    //     return `${x.course._id}.${x.section._id}`;
    //   } else if (/Page/.test(x.__typename)) {
    //     return null;
    //   } else if (/Edges/.test(x.__typename)) {
    //     return `${x.__typename}.${x.node._id}`;
    //   }
    //   // console.log('NO ID from ', result);
    //   return null;
    // },
    queryDeduplication: true,
    reduxRootSelector: (state) => state.apollo,
    // shouldBatch: true,
    ...options,
  });
}
