import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressJwt from 'express-jwt';
import { UnauthorizedError as Jwt401Error } from 'express-jwt';
import * as requestLanguage from 'express-request-language';
import { createServer } from 'http';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as PrettyError from 'pretty-error';
import * as React from 'react';
import { renderToStringWithData } from 'react-apollo';
import * as ReactDOM from 'react-dom/server';
import { IntlProvider } from 'react-intl';
import { StaticRouter } from 'react-router';
import { createApolloClient } from './apollo';
import * as IntlQuery from './apollo/intl/IntlQuery.gql';
import * as LOCALEQUERY from './apollo/intl/LocaleQuery.gql';
import * as assets from './assets.json';
import App from './components/App';
import { Html } from './components/Html';
import { api, auth, locales, port, wsport } from './config';
import { createSubscriptionServer } from './core/createSubscriptionsServer';
import passport from './core/passport';
import { ServerLink } from './core/ServerLink';
import Routes from './routes';
import ErrorPage from './routes/Error/ErrorPage';
import * as errorPageStyle from './routes/Error/ErrorPage.css';
import { database } from './schema';
import { Schema } from './schema/types/Schema';
/**
 * Express app
 */
interface HotExpress extends express.Express {
  hot: any;

  wsServer: any;
}

const app = express() as HotExpress;

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
declare var global: any;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, '../public')));
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
app.use('/graphql', bodyParser.json(), graphqlExpress((req, res) => {
  return {
    schema: Schema,
    context: {
      database,
      request: req,
      response: res,
    },
    rootValue: { request: req },
  };
}));

app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: api.wsUrl,
}));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
const setLocale = async (client: ApolloClient<any>, { locale, initialNow }, { cache }) => {
  const { data } = await client.query<IntlQuery.Query>({
    query: IntlQuery,
    variables: { locale },
  });

  const messages = data.intl.reduce((msgs, msg) => {
    msgs[msg.id] = msg.message;
    return msgs;
  }, {});

  client.writeQuery({
    query: LOCALEQUERY,
    data: {
      locale,
      initialNow,
      availableLocales: locales,
    },
  });

  const provider = new IntlProvider({
    initialNow,
    locale,
    messages,
    defaultLocale: 'en-US',
  });

  return provider.getChildContext().intl;
};

app.get('*', async (req, res, next) => {
  try {
    const location = req.url;

    // const fragmentMatcher = new IntrospectionFragmentMatcher({
    //   introspectionQueryResultData: {
    //     __schema: {
    //       types: [{
    //         kind: 'INTERFACE',
    //         name: 'UserType',
    //         possibleTypes: [{ name: 'User' }, { name: 'CoSeller' }],
    //       }],
    //     },
    //   },
    // });

    const cache = new InMemoryCache({
      dataIdFromObject(value: any) {
        // Page or Edges
        if (value.__typename.match(/(Page|Edges)/)) {
          return null;
        } else if (value._id) {
          return `${value.__typename}:${value._id}`;
        } else if (value.node) {
          return `${value.__typename}:${value.node._id}`;
        }
      },
      // fragmentMatcher,
    });

    const client = createApolloClient({
      local: new ServerLink({
        schema: Schema,
        rootValue: { request: req },
        context: {
          database,
          user: req.user,
        },
      }),
      ssrMode: true,
      cache,
    });

    // Fetch locale's messages
    const locale = req.language;
    const intl = await setLocale(client, {
      locale,
      initialNow: Date.now(),
    }, { cache });

    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        styles.forEach((style) => css.add(style._getCss()));
      },
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

    const children = await renderToStringWithData(component);

    const data: Html.IProps = {
      title: 'Typescript React Apollo Starter Kit',
      description: 'Typescript React Apollo Starter Kit - Universal web application apollo boilerplate' +
        ' using React, React Apollo, React Router, Node.js, MongoDB',
      styles: [
        { id: 'css', cssText: [...css].join('') },
      ],
      scripts: [assets.vendor.js, assets.client.js],
      app: {
        apiUrl: api.serverUrl,
        wsUrl: api.wsUrl,
        apollo: cache.extract(),
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
  } catch (err) {
    next(err);
  }
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
// const promise =
// tslint:disable-next-line:no-console
database.connect().catch((err) => console.error(err.stack));
if (!module.hot) {
  const server = createServer(app);
  createSubscriptionServer({ server });
  server.listen(port, () => { // on production it will be working under the same port as main app
    // tslint:disable-next-line:no-console
    console.info(`The server is running at http://localhost:${port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  const server = createServer();
  createSubscriptionServer({ server });
  server.listen(wsport, () => {
    // tslint:disable-next-line:no-console
    console.info(`The subscription server is running at http://localhost:${wsport}`);
  });

  app.wsServer = server;
  module.hot.accept('./routes');
}

export default app;
