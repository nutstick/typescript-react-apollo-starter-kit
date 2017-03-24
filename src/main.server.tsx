import { createNetworkInterface } from 'apollo-client';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as expressJwt from 'express-jwt';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import * as helmet from 'helmet';
import * as history from 'history';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as PrettyError from 'pretty-error';
import * as React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import * as ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './components/App';
import Html, { IHtmlProps } from './components/Html';
import { auth, locales, port } from './config';
import createApolloClient from './core/createApolloClient';
import passport from './core/passport';
import ServerInterface from './core/ServerInterface';
import { configureStore } from './redux/configureStore';
import { setLocale } from './redux/intl/actions';
import { setRuntimeVariable } from './redux/runtime/actions';
import routes from './routes';
import ErrorPage from './routes/Error/ErrorPage';
import * as errorPageStyle from './routes/error/ErrorPage.css';
import { Schema } from './schema';
import { database } from './schema/models';

/**
 * Load envirountment variables
 */
dotenv.load({ path: '.env' });

/**
 * Express app
 */
const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
declare var global: any;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

/**
 * Mongo Database
 */
database.connect((databaseError) => {
  if (databaseError) {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  }

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
  app.use('/graphql', bodyParser.json(), graphqlExpress((req) => ({
    context: {
      database,
      user: req.user,
    },
    schema: Schema,
    rootValue: { request: req },
    debug: __DEV__,
  })));
  if (process.env.NODE_ENV !== 'production') {
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  }

  /**
   * Register server-side rendering middleware
   */
  app.get('*', async (req, res, next) => {
    const location = req.url;
    const memoryHistory = createMemoryHistory(req.originalUrl);

    const apolloClient = createApolloClient({
      ssrMode: true,
      networkInterface: new ServerInterface({
        schema: Schema,
        rootValue: { request: req },
      }),
    });

    const store = configureStore({
      user: req.user || null,
    }, {
      history: memoryHistory,
      cookie: req.cookies,
      apolloClient,
    });

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    store.dispatch(setRuntimeVariable({
      name: 'availableLocales',
      value: locales,
    }));

    const css = new Set();

    const locale = req.query.lang || req.acceptsLanguages(locales);
    await store.dispatch(setLocale({
      locale,
    }));

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach((style) => css.add(style._getCss()));
      },
      store,
      client: apolloClient,
    };

    match ({ history: memoryHistory, routes: routes(store), location: req.url },
      (error, redirectLocation, renderProps) => {
      if (error) {
        return res.status(500).send(error.message);
      } else if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        /*console.log(ReactDOM.renderToString());
        const component = (
          <ApolloProvider client={apolloClient}>
            <RouterContext {...renderProps} />
          </ApolloProvider>
        );*/
        const component = (
          <App context={context}>
            <RouterContext {...renderProps} />
          </App>
        );

        // set children to match context
        const children = ReactDOM.renderToString(component);

        const data: IHtmlProps = {
          title: 'React Starter Kit',
          description: 'React starter kit using Typescript 2 and Webpack 2.',
          children,
          state: context.store.getState(),
          styles: [
            { id: 'css', cssText: [...css].join('') },
          ],
        };

        // rendering html components
        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
        res.status(200).send(`<!doctype html>${html}`);
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
        styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
      >
        {ReactDOM.renderToString(<ErrorPage error={err} />)}
      </Html>,
    );
    res.status(err.status || 500);
    res.send(`<!doctype html>${html}`);
  });

  app.listen(port, (error: Error) => {
    if (error) {
      // console.log(`%s Listening on http://localhost:${port}/`, chalk.red('[Error]'));
      console.log(error);
    } else {
      console.log(`Listening on http://localhost:${port}/`);
    }
  });

});
