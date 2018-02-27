import { Mutation } from 'react-apollo';
import * as SetLocaleMutationGraphQL from './SetLocaleMutation.gql';

export namespace SetLocaleMutation {
  export interface Variables {
    locale: string;
  }
  export type Result = SetLocaleMutationGraphQL.Payload;
}

export class SetLocaleMutation extends Mutation<SetLocaleMutation.Result, SetLocaleMutation.Variables> {
  static mutation = SetLocaleMutationGraphQL;
}
