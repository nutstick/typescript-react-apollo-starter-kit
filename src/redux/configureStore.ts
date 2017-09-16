import ApolloClient from 'apollo-client';
import { routerMiddleware } from 'react-router-redux';
import * as Redux from 'redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createReducer, injectAsyncReducer, State } from './';
import createHelpers from './createHelpers';
import logger from './logger';

interface IStore extends Redux.Store<any> {
  asyncReducers?: any;
  injectAsyncReducer?: (store, name, asyncReducer) => void;
}

interface Config {
  history: any;
  cookie?: any;
  apolloClient: ApolloClient;
  fetch: any;
}

export function configureStore(initialState: State, config?: Config): Redux.Store<any> {
  const helpers = createHelpers(config);
  const { apolloClient } = config;

  let middleware: Redux.Middleware[] = [
    // routerMiddleware(helpersConfig.history),
    thunk.withExtraArgument(createHelpers(helpers)),
    apolloClient.middleware(),
  ];

  let enhancer;

  if (__DEV__) {
    middleware.push(logger());

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = (f) => f;
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension();
    }

    enhancer = compose(applyMiddleware(...middleware), devToolsExtension);
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  const rootReducer = createReducer({
    apolloClient,
  });
  if (process.env.NODE_ENV === 'development' && process.env.BROWSER) {
    middleware = [...middleware, logger];
  }

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('./', () =>
      // Don't forget to remove `()` if you change reducers back to normal rootReducer.
      // eslint-disable-next-line global-require
      store.replaceReducer(require('./').createReducer({ apolloClient })),
    );
  }

  return store;
}
