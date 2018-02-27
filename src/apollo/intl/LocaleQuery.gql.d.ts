import { DocumentNode } from 'graphql';

declare const _: DocumentNode;
export = _;

declare namespace _ {
  export interface query {
    locale: string;
    initialNow: number;
    availableLocales: string[];
  }
}