import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

export const createReducer = (asyncReducers?: any) => {
  return combineReducers({
    routing: routerReducer,
    ...asyncReducers,
  });
};

export const injectAsyncReducer = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
};
