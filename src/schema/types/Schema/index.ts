import { GraphQLSchema, GraphQLString } from 'graphql';
import * as GraphQLDate from 'graphql-date';
import { makeExecutableSchema } from 'graphql-tools';
import { print } from 'graphql/language';
import * as IntlMessage from '../IntlMessage';
import * as Mutation from '../Mutation';
import * as Pagination from '../Pagination';
import * as Query from '../Query';
import * as Subscription from '../Subscription';
import * as User from '../User';
import * as SchemaType from './schema.gql';

const schema = [print(SchemaType)];
const modules = [
  Pagination,
  User,
  IntlMessage,
  Query,
  Subscription,
  Mutation,
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
