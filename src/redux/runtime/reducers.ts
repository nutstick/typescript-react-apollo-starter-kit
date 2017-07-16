import { SET_RUNTIME_VARIABLE } from './constants';

export interface IRuntimeState {
  [key: string]: any;
}

export const runtimeReducers = function runtime(state: IRuntimeState = {}, action) {
  switch (action.type) {
    case SET_RUNTIME_VARIABLE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};
