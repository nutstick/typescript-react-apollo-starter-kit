import { routerReducer } from 'react-router-redux';
import { combineReducers, Dispatch } from 'redux';
import { intlReducers } from './intl/reducers';
import { runtimeReducers } from './runtime/reducers';
import { uiReducers } from './ui/reducers';
import { IUserState, userReducers } from './user/reducers';

export interface IState {
  user: IUserState;
}

export type MapStateToProps<TStateProps, TOwnProps> = (state: IState, ownProps?: TOwnProps) => TStateProps;
export type MapDispatchToProps<TDispatchProps, TOwnProps> =
          (dispatch: Dispatch<IState>, ownProps?: TOwnProps) => TDispatchProps;

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
