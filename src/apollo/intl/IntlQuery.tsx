import { Query } from 'react-apollo';
import * as IntlQueryGraphQL from './IntlQuery.gql';

export namespace IntlQuery {
  export type result = IntlQueryGraphQL.query;
}

export class IntlQuery extends Query<IntlQueryGraphQL.query> {
  static query = IntlQueryGraphQL;
}
