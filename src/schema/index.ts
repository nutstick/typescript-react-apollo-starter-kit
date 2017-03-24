import { GraphQLSchema } from 'graphql';
import * as GraphQLDate from 'graphql-date';
import { makeExecutableSchema } from 'graphql-tools';
import * as SchemaType from './schema.gql';
import * as IntlMessage from './types/IntlMessage';
import * as Mutation from './types/Mutation';
import * as Query from './types/Query';
import * as User from './types/User';

const schema = [SchemaType];
const modules = [Query, User, IntlMessage];

const resolvers = Object.assign({ Date: GraphQLDate }, ...(modules.map((m) => m.resolver).filter((res) => res)));
const typeDefs = schema.concat(modules.map((m) => m.type).filter((res) => !!res));

const Schema: GraphQLSchema = makeExecutableSchema({
  logger: console,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
  resolvers,
  typeDefs,
});

export { Schema };
