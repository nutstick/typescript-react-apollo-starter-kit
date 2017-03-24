import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';

const PageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
    hasPreviousPage: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

export default PageInfoType;

