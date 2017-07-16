import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { intlReducers } from './intl/reducers';
import { runtimeReducers } from './runtime/reducers';
import { uiReducers } from './ui/reducers';
import { userReducers } from './user/reducers';

export const createReducer = (asyncReducers?: any) => {
  return combineReducers({
    routing: routerReducer,
    intl: intlReducers,
    runtime: runtimeReducers,
    user: userReducers,
    ui: uiReducers,
    ...asyncReducers,
  });
};

export const injectAsyncReducer = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
};
