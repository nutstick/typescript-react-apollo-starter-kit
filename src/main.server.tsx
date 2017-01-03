import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as expressJwt from 'express-jwt';
import * as helmet from 'helmet';
import * as history from 'history';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as path from 'path';
import * as PrettyError from 'pretty-error';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Html, { IHtmlProps } from './components/Html';
import { auth, locales, port } from './config';
import { configureStore } from './redux/configureStore';
import { setLocale } from './redux/intl/actions';
import { setRuntimeVariable } from './redux/runtime/actions';
import routes from './routes';
import ErrorPage from './routes/Error/ErrorPage';

import { schema } from './schema';

/**
 * Express app
 */
const app = express();

/**
 * Mongoose Database
 */
mongoose.connect('mongodb://localhost/apollo', (err) => {
  if (err) {
    console.log(err); //  eslint-disable-line no-console
    return err;
  }
  return true;
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
declare const global: any;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: (req) => req.cookies.id_token,
}));
app.use(passport.initialize());

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

/**
 * GraphQL Initialize
 */
app.use('/graphql', graphqlHTTP((req) => {
  return {
    schema,
    rootValue: { request: req },
    graphiql: process.env.NODE_ENV !== 'production',
  };
}));

/**
 * Register server-side rendering middleware
 */
app.get('*', async (req, res, next) => {
  const location = req.url;
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const store = configureStore({}, {
    history: memoryHistory,
    cookie: req.cookies,
  });
  const history = syncHistoryWithStore(memoryHistory, store);

  store.dispatch(setRuntimeVariable({
    name: 'availableLocales',
    value: locales,
  }));

  const locale = req.acceptsLanguages(locales);
  await store.dispatch(setLocale({
    locale,
  }));

  match ({ history, routes: routes(store), location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const data: IHtmlProps = {
        title: 'React Starter Kit',
        description: 'React starter kit using Typescript 2 and Webpack 2.',
        children: null,
        state: store.getState(),
      };
      const components = (
        <Provider store={store} key="provider">
          <RouterContext history={history} {...renderProps} />
        </Provider>
      );

      // set children to match context
      data.children = ReactDOM.renderToString(components);

      // rendering html components
      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

      res.status(200).send(`<doctype html>${html}`);
    } else {
      res.status(404).send('Not found');
    }
  });
});

/**
 * Error handling
 */
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');


app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

app.listen(port, (error: Error) => {
  /* if (error) {
    console.log(`%s Listening on http://localhost:${port}/`, chalk.red('[Error]'));
    console.log(error);
  } else {*/
  console.log(`Listening on http://localhost:${port}/`);
  // }
});
