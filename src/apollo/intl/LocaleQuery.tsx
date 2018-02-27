import { default as apollo } from 'react-apollo';
import { Query } from 'react-apollo';
import * as LocaleQueryGraphQL from './LocaleQuery.gql';

export namespace LocaleQuery {
  export type result = LocaleQueryGraphQL.query;
}

export class LocaleQuery extends Query<LocaleQueryGraphQL.query> {
  static query = LocaleQueryGraphQL;
}
