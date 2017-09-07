import * as Express from 'express';
import { SIGN_OUT } from './constants';

export interface IUserState {
  username?: string;
  email?: string;
}

export const userReducers = function user(state: IUserState = {}, action) {
  switch (action.type) {
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
};
