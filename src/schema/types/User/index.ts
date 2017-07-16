import { IPage } from '../Pagination';
import resolver from './resolver';
import * as type from './typeDef.gql';

interface IAccount {
  email: string;
}

interface IUser {
  _id?: string;
  name: string;
  account: IAccount;
  avatar: string;
  createAt?: Date;
  updateAt?: Date;
}

export {
  resolver,
  type,
  IUser,
};
