import { DocumentNode } from 'graphql';
import { IIntlMessage } from '../IntlMessage';
import { IUser } from '../User';

declare const _: DocumentNode;
export = _;

namespace _ {
  export interface IQuery {
    helloworld?: string;

    me?: IUser;

    intl: IIntlMessage[];
  }
}
