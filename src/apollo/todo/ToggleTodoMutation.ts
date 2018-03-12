import { Mutation } from 'react-apollo';
import * as ToggleTodoMutationGraphQL from './ToggleTodoMutation.gql';

export namespace ToggleTodoMutation {
  export interface Variables {
    id: number;
  }
  export type Result = ToggleTodoMutationGraphQL.Payload;
}

export class ToggleTodoMutation extends Mutation<ToggleTodoMutation.Result, ToggleTodoMutation.Variables> {
  static mutation = ToggleTodoMutationGraphQL;
}
