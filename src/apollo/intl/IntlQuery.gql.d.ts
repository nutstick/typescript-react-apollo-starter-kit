import { DocumentNode } from 'graphql';

declare const _: DocumentNode;
export = _;

declare namespace _ {
  export interface query {
    intl: Array<{
      id: string;
      message: string;
    }>;
  }
}
