import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import Layout from '../components/Layout';
import { injectAsyncReducer } from '../redux/reducers';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (store) => {
  return (<Route
    path="/"
    component={Layout}
  >
    <IndexRoute
      getComponent={(nextState, cb) => {
        // ตายที่ withStyle
        _import('./Home/Home')
          .then(loadModule(cb))
          .catch(errorLoading);
      }}
    />
  </Route>);
  // {
  //   component: App,
  //   childRoutes: [
  //     {
  //       path: '/',
  //       name: 'Home',
  //       getComponent(nextState, cb) {
  //         _import('./Home')
  //           .then(loadModule(cb))
  //           .catch(errorLoading);
  //       },
  //     }, {
  //       path: '*',
  //       name: 'NotFound',
  //       getComponent(nextState, cb) {
  //         _import('./NotFound')
  //           .then(loadModule(cb))
  //           .catch(errorLoading);
  //       },
  //     },
  //   ],
  // };
};
