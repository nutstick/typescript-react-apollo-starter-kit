import ApolloClient from 'apollo-client';
import { routerMiddleware } from 'react-router-redux';
import * as Redux from 'redux';
import { applyMiddleware, compose, createStore as _createStore } from 'redux';
import thunk from 'redux-thunk';
import createHelpers from './createHelpers';
import { IState } from './IState';
import logger from './logger';
import { createReducer, injectAsyncReducer } from './reducers';

interface IStore extends Redux.Store<any> {
  asyncReducers?: any;
  injectAsyncReducer?: (store, name, asyncReducer) => void;
}

interface IHelperConfig {
  history: any;
  cookie?: any;
  apolloClient: ApolloClient;
}

export function configureStore(initialState: IState, helpersConfig?: IHelperConfig): Redux.Store<any> {
  const { apolloClient } = helpersConfig;
  let middleware: Redux.Middleware[] = [
    // routerMiddleware(helpersConfig.history),
    thunk.withExtraArgument(createHelpers(helpersConfig)),
    apolloClient.middleware(),
  ];

  if (process.env.NODE_ENV === 'development' && process.env.BROWSER) {
    middleware = [...middleware, logger];
  }

  const composeEnhancers = (process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store: IStore = _createStore(
    createReducer({ apollo: apolloClient.reducer() }),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  );

  store.asyncReducers = {};
  store.injectAsyncReducer = injectAsyncReducer.bind(null, store);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer((require('./reducers')));
    });
  }

  return store;
};
