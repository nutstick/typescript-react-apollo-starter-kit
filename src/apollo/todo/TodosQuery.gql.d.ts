import { DocumentNode } from 'graphql';

declare const _: DocumentNode;
export = _;

declare namespace _ {
  export interface Query {
    todos: Array<{
      id: number;
      text: string;
      done: boolean;
    }>;
  }
}
