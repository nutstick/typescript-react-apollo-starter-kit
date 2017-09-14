import { RuntimeAction } from './actions';
import { SET_RUNTIME_VARIABLE } from './constants';

export interface RuntimeState {
  [key: string]: any;
}

export const runtimeReducers = function runtime(state: RuntimeState = {}, action: RuntimeAction) {
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
