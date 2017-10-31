import { combineReducers, Dispatch } from 'redux';
import { intlReducers, IntlState } from './intl/reducers';
import { runtimeReducers, RuntimeState } from './runtime/reducers';
import { uiReducers, UIState } from './ui/reducers';
import { userReducers, UserState } from './user/reducers';

export interface State {
  readonly user?: UserState;
  readonly intl?: IntlState;
  readonly runtime?: RuntimeState;
  readonly ui?: UIState;
  readonly apollo?: any;
}

export function createReducer({ apolloClient }) {
  return combineReducers<State>({
    apollo: apolloClient.reducer(),
    intl: intlReducers,
    runtime: runtimeReducers,
    user: userReducers,
    ui: uiReducers,
  });
}

export const injectAsyncReducer = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
};
