import { Mutation } from 'react-apollo';
import * as AddTodoMutationGraphQL from './AddTodoMutation.gql';

export namespace AddTodoMutation {
  export interface Variables {
    text: string;
  }
  export type Result = AddTodoMutationGraphQL.Payload;
}

export class AddTodoMutation extends Mutation<AddTodoMutation.Result, AddTodoMutation.Variables> {
  static mutation = AddTodoMutationGraphQL;
}
