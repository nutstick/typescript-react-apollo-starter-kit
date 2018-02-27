import { Query } from 'react-apollo';
import * as LocaleQueryGraphQL from './LocaleQuery.gql';

export namespace LocaleQuery {
  export type Result = LocaleQueryGraphQL.Query;
}

export class LocaleQuery extends Query<LocaleQuery.Result> {
  static query = LocaleQueryGraphQL;
}
