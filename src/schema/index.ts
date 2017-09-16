import { GraphQLSchema, GraphQLString } from 'graphql';
import * as GraphQLDate from 'graphql-date';
import { makeExecutableSchema } from 'graphql-tools';
import { print } from 'graphql/language';
import * as SchemaType from './schema.gql';
import * as IntlMessage from './types/IntlMessage';
import * as Mutation from './types/Mutation';
import * as Pagination from './types/Pagination';
import * as Query from './types/Query';
import * as User from './types/User';

const schema = [print(SchemaType)];
const modules = [
  Pagination,
  User,
  IntlMessage,
  Query,
  // Mutation,
];

const resolvers = Object.assign({
    Date: GraphQLDate,
    // Time: GraphQLString,
  },
  ...(modules.map((m) => m.resolver).filter((res) => res)),
);
const typeDefs = schema.concat(modules.map((m) => print(m.type)).filter((res) => !!res));

const Schema = makeExecutableSchema({
  logger: console,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
  resolvers,
  typeDefs,
});

export { Schema };
