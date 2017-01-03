import { Promise } from 'es6-promise';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, match, Router, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import { configureStore } from './redux/configureStore';
import routes from './routes';

const data = window.__INITIAL_STATE__;
const store = configureStore(data, {
  history: browserHistory,
});

const history = syncHistoryWithStore(browserHistory, store);

const render = (routes) => {
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    console.log(renderProps);
    ReactDom.render(
      (<HotEnabler>
        <Provider store={store} key="provider">
          <Router {...renderProps} render={applyRouterMiddleware(useScroll())} history={history}>
            {routes}
          </Router>
        </Provider>
      </HotEnabler>),
      document.getElementById('app'),
    );
  });
};

render(routes(store));

/**
 * TODO
 * example reference: https://github.com/bertho-zero/react-redux-universal-hot-example/blob/master/src/client.js
 */
// if (module.hot) {
//   module.hot.accept('./routes', () => {
//     const nextRoutes = require('./routes')(store);
//     render(nextRoutes);
//   });
// }

// if (process.env.NODE_ENV !== 'production') {
//   window.React = React; // enable debugger

//   if (!dest || !dest.firstChild || !dest.firstChild.attributes
//     || !dest.firstChild.attributes['data-react-checksum']) {
//     console.error('Server-side React render was discarded.' +
//       'Make sure that your initial render does not contain any client-side code.');
//   }
// }

// if (__DEVTOOLS__ && !window.devToolsExtension) {
//   const devToolsDest = document.createElement('div');
//   window.document.body.insertBefore(devToolsDest, null);
//   const DevTools = require('./containers/DevTools/DevTools');
//   ReactDOM.render(
//     <Provider store={store} key="provider">
//       <DevTools />
//     </Provider>,
//     devToolsDest
//   );
// }

// if (online && !__DEVELOPMENT__ && 'serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
//     .then(() => {
//       console.log('Service worker registered!');
//     })
//     .catch(error => {
//       console.log('Error registering service worker: ', error);
//     });

//   navigator.serviceWorker.ready.then((/* registration */) => {
//     console.log('Service Worker Ready');
//   });
// }
// });
