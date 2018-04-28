import { DocumentNode } from 'graphql';

declare const _: DocumentNode;
export = _;

declare namespace _ {
  export interface IIntlMessage {
    id: string;
    defaultMessage: string;
    message?: string;
    description?: string;
    files?: string[];
  }
}
