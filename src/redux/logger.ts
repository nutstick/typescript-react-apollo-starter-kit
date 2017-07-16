import {  } from 'immutable';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  collapsed: true,
  stateTransformer: (state) => {
    return state.toJS ? state.toJS() : state;
  },
  predicate: (getState, { type }) => {
    return type !== 'redux-form/BLUR' &&
           type !== 'redux-form/CHANGE' &&
           type !== 'redux-form/FOCUS' &&
           type !== 'redux-form/TOUCH';
  },
});

export default logger;
