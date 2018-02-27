import { DocumentNode } from 'graphql';

import { IUser } from '../User';
import { IIntlMessage } from '../IntlMessage';

declare const _: DocumentNode;
export = _;

namespace _ {
  export interface IQuery {
    helloworld?: string;

    me?: IUser;

    intl: IIntlMessage[];
  }
}