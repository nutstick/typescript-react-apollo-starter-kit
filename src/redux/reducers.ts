import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { intlReducers } from './intl/reducers'
import { runtimeReducers } from './runtime/reducers'

export const createReducer = (asyncReducers?: any) => {
  return combineReducers({
    routing: routerReducer,
    intl: intlReducers,
    runtime: runtimeReducers,
    ...asyncReducers,
  });
};

export const injectAsyncReducer = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
};
