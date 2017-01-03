import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../components/App';
import HomeRoute from './Home';
import NotFoundRoute from './NotFound';

/*declare const System: any;
if (typeof System.import === 'undefined') {
  System.import = (module) => Promise.resolve(require(module));
}*/

export default (store) => {
  return {
    path: '/',
    getComponent (nextState, cb) {
      cb(null, App);
    },
    indexRoute: HomeRoute,
    childRoutes: [
      NotFoundRoute,
    ],
  };
};

// export default (store) => {
//   return (
//     <Route path="/" component={App}>
//       {/* Home (main) route */}
//       <IndexRoute component={Home} />

//       {/* Catch all route */}
//       <Route path="*" component={NotFound} status={404} />
//     </Route>
//   );
// };
