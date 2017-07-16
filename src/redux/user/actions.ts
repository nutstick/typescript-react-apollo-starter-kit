import { push } from 'react-router-redux';
import { SIGN_OUT } from './constants';

export function signOut() {
  return (dispatch) => {
    dispatch({
      type: SIGN_OUT,
    });
    dispatch(push('/logout'));
  };
}
