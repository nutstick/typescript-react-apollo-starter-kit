import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import PageInfoType from './PageInfoType';
import ThreadType from './ThreadType';

const ThreadEdge = new GraphQLObjectType({
  name: 'ThreadEdge',
  fields: () => ({
    cursor: { type: GraphQLString },
    node: { type: ThreadType },
  }),
})

const ThreadConnection = new GraphQLObjectType({
  name: 'ThreadConnection',
  fields: () => ({
    edges: {
      type: new GraphQLList(ThreadEdge),
      resolve() {
        return [];
      }
    },
    pageInfo: {
      type: new GraphQLNonNull(PageInfoType),
    }
  })
});

export default ThreadConnection;
