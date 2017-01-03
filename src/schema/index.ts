import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { fromGlobalId, nodeDefinitions } from 'graphql-relay';
import { User } from '../models';

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Thread') {
      return await Thread.findById(id).exec();
    } else if (type === 'User') {
      return await User.findById(id).exec();
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Thread) {
      return ThreadType;
    } else if (obj instanceof User) {
      return UserType;
    }
    return null;
  }
);

export default class Schema extends GraphQLSchema {
  constructor() {
    super({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          viewer: {
            type: UserType,
            resolve: async (_, __, { request }) => {
              return await User.findById(request.user.id).exec();
            },
            node: nodeField,
          }
        },
      }),
    })
  }
}