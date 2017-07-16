import * as Express from 'express';
import { SIGN_OUT } from './constants';

export type IUserState = any;

export const userReducers = function user(state: IUserState = {}, action) {
  switch (action.type) {
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
};
