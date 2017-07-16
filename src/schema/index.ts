import { GraphQLSchema, GraphQLString } from 'graphql';
import * as GraphQLDate from 'graphql-date';
import { makeExecutableSchema } from 'graphql-tools';
import { print } from 'graphql/language';
import * as SchemaType from './schema.gql';
import * as Course from './types/Course';
import * as CourseGroup from './types/CourseGroup';
import * as CourseTable from './types/CourseTable';
import * as IntlMessage from './types/IntlMessage';
import * as Mutation from './types/Mutation';
import * as Pagination from './types/Pagination';
import * as Query from './types/Query';
import * as SearchResult from './types/SearchResult';
import * as Section from './types/Section';
import * as Teacher from './types/Teacher';
import * as TimeInterval from './types/TimeInterval';
import * as User from './types/User';

const schema = [print(SchemaType)];
const modules = [
  Pagination,
  User,
  IntlMessage,
  Teacher,
  TimeInterval,
  Section,
  Course,
  CourseTable,
  CourseGroup,
  SearchResult,
  Query,
  Mutation,
];

const resolvers = Object.assign({
    Date: GraphQLDate,
    Time: GraphQLString,
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
