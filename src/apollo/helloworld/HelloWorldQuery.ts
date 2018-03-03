import { Query } from 'react-apollo';
import * as HelloWorldQueryGraphQL from './HelloWorld.gql';

export namespace HelloWorldQuery {
  export type Result = HelloWorldQueryGraphQL.Query;
}

export class HelloWorldQuery extends Query<HelloWorldQuery.Result> {
  static query = HelloWorldQueryGraphQL;
}
