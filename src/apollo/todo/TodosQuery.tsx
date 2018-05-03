import * as React from 'react';
import { OperationVariables, Query, QueryResult } from 'react-apollo';
import * as TodosQueryGraphQL from './TodosQuery.gql';

export namespace TodosQuery {
  export interface Props<TData = any, TVariables = OperationVariables> {
    children: (result: QueryResult<TData, TVariables>) => React.ReactNode;
  }
}

export class TodosQuery extends React.Component<TodosQuery.Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return <Query query={TodosQueryGraphQL}>
      {this.props.children}
    </Query>;
  }
}
