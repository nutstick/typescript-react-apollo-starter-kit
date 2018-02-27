import { Query } from 'react-apollo';
import * as IntlQueryGraphQL from './IntlQuery.gql';

export namespace IntlQuery {
  export type Result = IntlQueryGraphQL.Query;
}

export class IntlQuery extends Query<IntlQuery.Result> {
  static query = IntlQueryGraphQL;
}
