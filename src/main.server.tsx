import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as BluebirdPromise from 'bluebird';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
// import * as expressGraphQL from 'express-graphql';
import * as expressJwt from 'express-jwt';
import { UnauthorizedError as Jwt401Error } from 'express-jwt';
import gql from 'graphql-tag';
import * as jwt from 'jsonwebtoken';
import * as nodeFetch from 'node-fetch';
import * as path from 'path';
import * as PrettyError from 'pretty-error';
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';
import * as ReactDOM from 'react-dom/server';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import * as assets from './assets.json';
import App from './components/App';
import { Html } from './components/Html';
import { api, auth, locales, port } from './config';
import createApolloClient from './core/createApolloClient';
import passport from './core/passport';
import { requestLanguage } from './core/requestLanguage';
import { ServerLink } from './core/ServerLink';
import createFetch from './createFetch';
import Routes from './routes';
import ErrorPage from './routes/Error/ErrorPage';
import * as errorPageStyle from './routes/Error/ErrorPage.css';
import { Schema } from './schema';
import { database } from './schema/models';
/**
 * Express app
 */
interface HotExpress extends express.Express {
  hot: any;
}

const app = express() as HotExpress;

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  requestLanguage({
    languages: locales,
    queryName: 'lang',
    cookie: {
      name: 'lang',
      options: {
        path: '/',
        maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
      },
      url: '/lang/{language}',
    },
  }),
);
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
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    // tslint:disable-next-line:no-console
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});
app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign({
      _id: req.user._id,
    }, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

app.get('/logout', (req, res) => {
  res.cookie('id_token', null);
  req.logout();
  res.redirect('/');
});

//
// Register API middleware
// -----------------------------------------------------------------------------
// const graphqlMiddleware = expressGraphQL((req) => ({
//   schema: Schema,
//   graphiql: __DEV__,
//   rootValue: { request: req },
//   pretty: __DEV__,
// }));

// app.use('/graphql', graphqlMiddleware);
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  const location = req.url;

  const client = createApolloClient({
    link: new ServerLink({
      schema: Schema,
      rootValue: { request: req },
    }),
    // networkInterface: new ServerInterface({
    //   schema: Schema,
    //   rootValue: { request: req },
    // }),
    cache: new InMemoryCache(),
    ssrMode: true,
  });

  // Universal HTTP client
  const fetch = createFetch(nodeFetch, {
    baseUrl: api.serverUrl,
    cookie: req.headers.cookie,
    // apolloClient,
  });

  const state = {
    locales: {
      availableLocales: locales,
    },
    runtimeVariable: {
      initialNow: Date.now(),
    },
  };

  // Fetch locale's messages
  const locale = req.language;
  // TODO: messages: localeMessages
  const intl = new IntlProvider({
    initialNow: Date.now(),
    locale,
    messages: {},
    defaultLocale: 'en-US',
  }).getChildContext().intl;

  const css = new Set();

  // Global (context) variables that can be easily accessed from any React component
  // https://facebook.github.io/react/docs/context.html
  const context = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach((style) => css.add(style._getCss()));
    },
    fetch,
    // Apollo Client for use with react-apollo
    client,
    // intl instance as it can be get with injectIntl
    intl,
  };

  const component = (
    <App context={context}>
      <StaticRouter location={location} context={context}>
        <Routes />
      </StaticRouter>
    </App>
  );
  // set children to match context
  await getDataFromTree(component);
  await BluebirdPromise.delay(0);
  const children = await ReactDOM.renderToString(component);

  const data: Html.IProps = {
    title: 'Typescript ReactQL Starter Kit',
    description: 'React starter kit using Typescript 2 and Webpack 2.',
    styles: [
      { id: 'css', cssText: [...css].join('') },
    ],
    scripts: [assets.vendor.js, assets.client.js],
    app: {
      apiUrl: api.clientUrl,
      // state: context.store.getState(),
      lang: locale,
    },
    children,
  };

  if (__DEV__) {
    // tslint:disable-next-line:no-console
    console.log('Serializing store...');
  }

  // rendering html components
  const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
  res.status(200).send(`<!doctype html>${html}`);
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  const locale = req.language;
  // tslint:disable-next-line:no-console
  console.log(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]}
      app={{ lang: locale }}
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
// tslint:disable-next-line:no-console
const promise = database.connect().catch((err) => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.info(`The server is running at http://localhost:${port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  // module.hot.accept('./routes');

  module.hot.accept();
}

export default app;
