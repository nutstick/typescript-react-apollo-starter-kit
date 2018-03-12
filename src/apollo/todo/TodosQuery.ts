import { Query } from 'react-apollo';
import * as TodosQueryGraphQL from './TodosQuery.gql';

export namespace TodosQuery {
  export type Result = TodosQueryGraphQL.Query;
}

export class TodosQuery extends Query<TodosQuery.Result> {
  static query = TodosQueryGraphQL;
}
