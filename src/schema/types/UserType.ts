import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import ThreadConnectionType from './ThreadConnectionType';
import { createThreadConnection } from '../helper/query';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    avatarUrl: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        size: { type: GraphQLInt },
      },
      resolve({ avatarUrl }) {
        return avatarUrl;
      },
    },
    email: { type: GraphQLString },
    createAt: { type: DateType },
    rating: {
      type: GraphQLInt,
      resolve({ ratingScore, ratingCount }) {
        return ratingScore / ratingCount;
      },
    },
    threads: {
      type: ThreadConnectionType,
      args: {
        first: { type: GraphQLInt },
        after: { type: GraphQLString },
        last: { type: GraphQLInt },
        before: { type: GraphQLString },
      },
      async resolve({ id }, { first, after, last, before }, { request }) {
        if (request.user.id.toString() !== id) {
          return null;
        }
        return createThreadConnection(id, first, last);
      },
    },
  }),
});

export default UserType;
