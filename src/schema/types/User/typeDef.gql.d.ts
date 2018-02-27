import { DocumentNode } from 'graphql';
// import { IPage } from '../Pagination';

declare const _: DocumentNode;
export = _;

declare namespace _ {
  interface IAccount {
    email: string;
  }

  export interface IUser {
    _id?: string;
    name: string;
    account: IAccount;
    avatar: string;
    createAt?: Date;
    updateAt?: Date;
  }
}
