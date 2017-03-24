// Needed for redux-saga es6 generator support
// import '!file?name=[name].[ext]!./manifest.json';
// import 'file?name=[name].[ext]!./.htaccess';
// Load the favicon, the manifest.json file and the .htaccess file
// import 'file?name=[name].[ext]!./favicon.ico';
// Import all the third party stuff
import { createNetworkInterface } from 'apollo-client';
import * as FastClick from 'fastclick';
import * as FontFaceObserver from 'fontfaceobserver';
import { createPath } from 'history/PathUtils';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import cs from 'react-intl/locale-data/cs';
import en from 'react-intl/locale-data/en';
import { match, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './components/App';
import createApolloClient from './core/createApolloClient';
import { deepForceUpdate, ErrorReporter } from './core/devUtils';
import { updateMeta } from './core/DOMUtils';
import history from './core/history';
import { configureStore } from './redux/configureStore';
import createRoutes from './routes';

const apolloClient = createApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/graphql',
    opts: {
      // Additional fetch options like `credentials` or `headers`
      credentials: 'include',
    },
  }),
});

[en, cs].forEach(addLocaleData);

const openSansObserver = new FontFaceObserver('Open Sans', {});

openSansObserver.load().then(() => {
  document.body.classList.add('font-loaded');
}, () => {
  document.body.classList.remove('font-loaded');
});

const store = configureStore(window.__INITIAL_STATE__, {
  history,
  apolloClient,
});

const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    console.log(styles)
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map((x) => x._insertCss());
    return () => { removeCss.forEach((f) => f()); };
  },
  // For react-apollo
  client: apolloClient,
  // Initialize a new Redux store
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store,
};

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete(route?, location?) {
  const elem = document.getElementById('css');
  if (elem) {
    elem.parentNode.removeChild(elem);
  }
  onRenderComplete = function renderComplete(route, location) {
    document.title = route.title;

    updateMeta('description', route.description);
    // Update necessary tags in <head> at runtime here, ie:
    // updateMeta('keywords', route.keywords);
    // updateCustomMeta('og:url', route.canonicalUrl);
    // updateCustomMeta('og:image', route.imageUrl);
    // updateLink('canonical', route.canonicalUrl);
    // etc.

    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location.key];
    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location.hash.substr(1);
      if (targetHash) {
        const target = document.getElementById(targetHash);
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    // Restore the scroll position if it was saved into the state
    // or scroll to the given #hash anchor
    // or scroll to top of the page
    window.scrollTo(scrollX, scrollY);

    // Google Analytics tracking. Don't send 'pageview' event after
    // the initial rendering, as it was already sent
    if (window.ga) {
      window.ga('send', 'pageview', createPath(location));
    }
  };
};

// Make taps on links and buttons work fast on mobiles
(FastClick as any).attach(document.body);

let appInstance;
let currentLocation = history.location;

// Re-render the app when window.location changes
async function onLocationChange(location?, action?) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;

  const routes = createRoutes(store);
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
      <App context={context}>
        <Router
          {...renderProps}
        >
        </Router>
      </App>,
      document.getElementById('app'),
      () => onRenderComplete(renderProps, location),
    );
  });
}

export default function main() {
  // Handle client-side navigation by using HTML5 History API
  // For more information visit https://github.com/mjackson/history#readme
  currentLocation = history.location;
  history.listen(onLocationChange);
  onLocationChange(currentLocation);
}

// Handle errors that might happen after rendering
// Display the error in full-screen for development mode
if (__DEV__) {
  window.addEventListener('error', (event) => {
    appInstance = null;
    document.title = `Runtime Error: ${(event as any).error.message}`;
    ReactDOM.render(<ErrorReporter error={(event as any).error} />, document.getElementById('app'));
  });
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes', async () => {
    const routes = createRoutes(store);

    currentLocation = history.location;
    await onLocationChange(currentLocation);
    if (appInstance) {
      try {
        // Force-update the whole tree, including components that refuse to update
        deepForceUpdate(appInstance);
      } catch (error) {
        appInstance = null;
        document.title = `Hot Update Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, document.getElementById('app'));
      }
    }
  });
}
