import { Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { State } from '../';
import { SIGN_OUT } from './constants';

export type ISignOut = (dispatch: Dispatch<State>) => void;

export function signOut() {
  return (dispatch) => {
    dispatch({
      type: SIGN_OUT,
    });
    dispatch(push('/logout'));
  };
}
