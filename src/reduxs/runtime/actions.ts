import { SET_RUNTIME_VARIABLE } from './constants';

export interface ISetRuntimeVariable {
  type: SET_RUNTIME_VARIABLE;
  payload: {
    name: string,
    value: any,
  };
}

export type RuntimeAction = ISetRuntimeVariable;

export function setRuntimeVariable({ name, value }): ISetRuntimeVariable {
  return {
    type: SET_RUNTIME_VARIABLE,
    payload: {
      name,
      value,
    },
  };
}
