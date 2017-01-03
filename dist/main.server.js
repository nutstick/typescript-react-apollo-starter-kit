module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("react");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("react-router-redux");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.port = process.env.PORT || 3000;
exports.host = process.env.WEBSITE_HOSTNAME || `localhost:${ exports.port }`;
// default locale is the first one
exports.locales = ['en-US', 'cs-CZ'];
exports.analytics = {
    // https://analytics.google.com/
    google: {
        trackingId: 'UA-64309227-1'
    }
};
exports.auth = {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },
    // https://developers.facebook.com/
    facebook: {
        id: process.env.FACEBOOK_APP_ID || '186244551745631',
        secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc'
    },
    // https://cloud.google.com/console/project
    google: {
        id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
        secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd'
    },
    // https://apps.twitter.com/
    twitter: {
        key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
        secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ'
    }
};

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("redux");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const React = __webpack_require__(0);
const Helmet = __webpack_require__(35);
const config_1 = __webpack_require__(2);
const Html = ({ title, description, children, state }) => {
    const head = Helmet.rewind();
    return React.createElement("html", { className: "no-js" }, React.createElement("head", null, head.base.toComponent(), head.title.toComponent(), head.meta.toComponent(), head.link.toComponent(), head.script.toComponent(), React.createElement("meta", { charSet: "utf-8" }), React.createElement("meta", { httpEquiv: "x-ua-compatible", content: "ie=edge" }), React.createElement("meta", { name: "description", content: description }), React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), React.createElement("link", { rel: "apple-touch-icon", href: "apple-touch-icon.png" })), React.createElement("body", null, React.createElement("div", { id: "app", dangerouslySetInnerHTML: { __html: children } }), state && React.createElement("script", { dangerouslySetInnerHTML: { __html: `window.__INITIAL_STATE__=${ JSON.stringify(state) }` } }), React.createElement("script", { defer: true, src: "/assets/vendor.js" }), React.createElement("script", { defer: true, src: "/assets/client.js" }), config_1.analytics.google.trackingId && React.createElement("script", { dangerouslySetInnerHTML: { __html: 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' + `ga('create','${ config_1.analytics.google.trackingId }','auto');ga('send','pageview')` } }), config_1.analytics.google.trackingId && React.createElement("script", { src: "https://www.google-analytics.com/analytics.js", async: true, defer: true })));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Html;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const react_router_redux_1 = __webpack_require__(1);
const redux_1 = __webpack_require__(3);
const redux_thunk_1 = __webpack_require__(37);
const createHelpers_1 = __webpack_require__(25);
const logger_1 = __webpack_require__(27);
const reducers_1 = __webpack_require__(28);
function configureStore(initialState, helpersConfig) {
    let middleware = [react_router_redux_1.routerMiddleware(helpersConfig.history), redux_thunk_1.default.withExtraArgument(createHelpers_1.default(helpersConfig))];
    if (false) {
        middleware = [...middleware, logger_1.default];
    }
    const composeEnhancers = "development" === 'development' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux_1.compose;
    const store = redux_1.createStore(reducers_1.createReducer(), initialState, composeEnhancers(redux_1.applyMiddleware(...middleware)));
    store.asyncReducers = {};
    store.injectAsyncReducer = reducers_1.injectAsyncReducer.bind(null, store);
    if (false) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(require('./reducers'));
        });
    }
    return store;
}
exports.configureStore = configureStore;
;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const constants_1 = __webpack_require__(26);
const query = `
  query ($locale:String!) {
    intl (locale:$locale) {
      id
      message
    }
  }
`;
function setLocale({ locale }) {
    return (dispatch, getState, { graphqlRequest }) => __awaiter(this, void 0, void 0, function* () {
        dispatch({
            type: constants_1.SET_LOCALE_START,
            payload: {
                locale
            }
        });
        try {
            const { data } = yield graphqlRequest(query, { locale });
            const messages = data.intl.reduce((msgs, msg) => {
                msgs[msg.id] = msg.message; // eslint-disable-line no-param-reassign
                return msgs;
            }, {});
            dispatch({
                type: constants_1.SET_LOCALE_SUCCESS,
                payload: {
                    locale,
                    messages
                }
            });
            // remember locale for every new request
            if (false) {
                const maxAge = 3650 * 24 * 3600; // 10 years in seconds
                document.cookie = `lang=${ locale };path=/;max-age=${ maxAge }`;
            }
        } catch (error) {
            dispatch({
                type: constants_1.SET_LOCALE_ERROR,
                payload: {
                    locale,
                    error
                }
            });
            return false;
        }
        return true;
    });
}
exports.setLocale = setLocale;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const constants_1 = __webpack_require__(29);
function setRuntimeVariable({ name, value }) {
    return {
        type: constants_1.SET_RUNTIME_VARIABLE,
        payload: {
            name,
            value
        }
    };
}
exports.setRuntimeVariable = setRuntimeVariable;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const App_1 = __webpack_require__(24);
const Home_1 = __webpack_require__(31);
const NotFound_1 = __webpack_require__(33);
Object.defineProperty(exports, "__esModule", { value: true });
/*declare const System: any;
if (typeof System.import === 'undefined') {
  System.import = (module) => Promise.resolve(require(module));
}*/
exports.default = store => {
    return {
        path: '/',
        getComponent(nextState, cb) {
            cb(null, App_1.default);
        },
        indexRoute: Home_1.default,
        childRoutes: [NotFound_1.default]
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const graphql_1 = __webpack_require__(34);
const schema = graphql_1.buildSchema(`
  type Query {
    hello: String
  }
`);
exports.schema = schema;
const root = {
  hello: () => {
    return 'Hello world!';
  }
};
exports.root = root;

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("body-parser");

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("cookie-parser");

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("express");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("express-graphql");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("express-jwt");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("helmet");

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = require("mongoose");

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("passport");

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = require("pretty-error");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("react-dom/server");

/***/ },
/* 22 */
/***/ function(module, exports) {

module.exports = require("react-redux");

/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = require("react-router");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const React = __webpack_require__(0);
class App extends React.Component {
    render() {
        return React.createElement("div", null, React.createElement("h1", null, "Hello World!"), this.props.children);
    }
}
App.propTypes = {
    children: React.PropTypes.node
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetch(url, config) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(config.method, url);
        Object.keys(config.headers).forEach(header => {
            request.setRequestHeader(header, config.headers[header]);
        });
        request.withCredentials = true;
        request.onload = () => {
            if (request.status === 200) {
                return resolve(request.response);
            }
            reject('Unable to load RSS');
        };
        request.onerror = () => {
            reject('Unable to load RSS');
        };
        request.send(config.body);
    });
}
function createGraphqlRequest(fetchKnowingCookie) {
    return (query, variables) => __awaiter(this, void 0, void 0, function* () {
        const fetchConfig = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables }),
            credentials: 'include'
        };
        const resp = yield fetchKnowingCookie('/graphql', fetchConfig);
        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }
        return yield resp.json();
    });
}
function createFetchKnowingCookie({ cookie }) {
    if (true) {
        return (url, options = {}) => {
            const isLocalUrl = /^\/($|[^\/])/.test(url); // eslint-disable-line no-useless-escape
            // pass cookie only for itself.
            // We can't know cookies for other sites BTW
            if (isLocalUrl && options.credentials === 'include') {
                const headers = __assign({}, options.headers, { Cookie: cookie });
                return fetch(url, __assign({}, options, { headers }));
            }
            return fetch(url, options);
        };
    }
    return fetch;
}
function createHelpers(config) {
    const fetchKnowingCookie = createFetchKnowingCookie(config);
    const graphqlRequest = createGraphqlRequest(fetchKnowingCookie);
    return {
        fetch: fetchKnowingCookie,
        graphqlRequest,
        history: config.history
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createHelpers;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.SET_LOCALE_START = 'SET_LOCALE_START';
exports.SET_LOCALE_SUCCESS = 'SET_LOCALE_SUCCESS';
exports.SET_LOCALE_ERROR = 'SET_LOCALE_ERROR';

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const createLogger = __webpack_require__(36);
const logger = createLogger({
    collapsed: true,
    /*stateTransformer: (state) => {
      return immutableToJS(state);
    },*/
    predicate: (getState, { type }) => {
        return type !== 'redux-form/BLUR' && type !== 'redux-form/CHANGE' && type !== 'redux-form/FOCUS' && type !== 'redux-form/TOUCH';
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logger;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
const react_router_redux_1 = __webpack_require__(1);
const redux_1 = __webpack_require__(3);
exports.createReducer = asyncReducers => {
    return redux_1.combineReducers(__assign({ routing: react_router_redux_1.routerReducer }, asyncReducers));
};
exports.injectAsyncReducer = (store, name, asyncReducer) => {
    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(exports.createReducer(store.asyncReducers));
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.SET_RUNTIME_VARIABLE = 'SET_RUNTIME_VARIABLE';

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const React = __webpack_require__(0);
class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", null, React.createElement("h1", null, this.props.title), React.createElement("p", null, "Homepage"));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const Home_1 = __webpack_require__(30);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getComponent(nextState, cb) {
        cb(null, Home_1.default);
    }
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const React = __webpack_require__(0);
class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", null, React.createElement("h1", null, this.props.title), React.createElement("p", null, "Sorry, the page you were trying to view does not exist."));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const React = __webpack_require__(0);
const NotFound_1 = __webpack_require__(32);
const title = "Page not found";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    path: "*",
    action() {
        return {
            title,
            components: React.createElement(NotFound_1.default, { title: title }),
            status: 404
        };
    }
};

/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = require("graphql");

/***/ },
/* 35 */
/***/ function(module, exports) {

module.exports = require("react-helmet");

/***/ },
/* 36 */
/***/ function(module, exports) {

module.exports = require("redux-logger");

/***/ },
/* 37 */
/***/ function(module, exports) {

module.exports = require("redux-thunk");

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _this = this;

var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bodyParser = __webpack_require__(10);
const cookieParser = __webpack_require__(11);
const express = __webpack_require__(12);
const graphqlHTTP = __webpack_require__(13);
const expressJwt = __webpack_require__(14);
const helmet = __webpack_require__(15);
const jwt = __webpack_require__(16);
const mongoose = __webpack_require__(17);
const passport = __webpack_require__(18);
const path = __webpack_require__(19);
const PrettyError = __webpack_require__(20);
const React = __webpack_require__(0);
const ReactDOM = __webpack_require__(21);
const react_redux_1 = __webpack_require__(22);
const react_router_1 = __webpack_require__(23);
const react_router_redux_1 = __webpack_require__(1);
const Html_1 = __webpack_require__(4);
const config_1 = __webpack_require__(2);
const configureStore_1 = __webpack_require__(5);
const actions_1 = __webpack_require__(6);
const actions_2 = __webpack_require__(7);
const routes_1 = __webpack_require__(8);
const ErrorPage_1 = __webpack_require__(39);
const schema_1 = __webpack_require__(9);
function format(time) {
    return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
/**
 * Express app
 */
const app = express();
/**
 * Mongoose Database
 */
mongoose.connect('mongodb://localhost/apollo', err => {
    if (err) {
        console.log(err); //  eslint-disable-line no-console
        return err;
    }
    return true;
});
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
    secret: config_1.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token
}));
app.use(passport.initialize());
app.get('/login/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }));
app.get('/login/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', session: false }), (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config_1.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
});
/**
 * GraphQL Initialize
 */
app.use('/graphql', graphqlHTTP(req => {
    return {
        schema: schema_1.schema,
        rootValue: { request: req },
        graphiql: "development" !== 'production'
    };
}));
/**
 * Register server-side rendering middleware
 */
app.get('*', (req, res, next) => __awaiter(_this, void 0, void 0, function* () {
    const location = req.url;
    const memoryHistory = react_router_1.createMemoryHistory(req.originalUrl);
    const store = configureStore_1.configureStore({}, {
        history: memoryHistory,
        cookie: req.cookies
    });
    const history = react_router_redux_1.syncHistoryWithStore(memoryHistory, store);
    store.dispatch(actions_2.setRuntimeVariable({
        name: 'availableLocales',
        value: config_1.locales
    }));
    const locale = req.acceptsLanguages(config_1.locales);
    yield store.dispatch(actions_1.setLocale({
        locale
    }));
    react_router_1.match({ history, routes: routes_1.default(store), location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            return res.status(500).send(error.message);
        } else if (redirectLocation) {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            const data = {
                title: 'React Starter Kit',
                description: 'React starter kit using Typescript 2 and Webpack 2.',
                children: null,
                state: store.getState()
            };
            const components = React.createElement(react_redux_1.Provider, { store: store, key: "provider" }, React.createElement(react_router_1.RouterContext, __assign({ history: history }, renderProps)));
            // set children to match context
            data.children = ReactDOM.renderToString(components);
            // rendering html components
            const html = ReactDOM.renderToStaticMarkup(React.createElement(Html_1.default, __assign({}, data)));
            res.status(200).send(`<doctype html>${ html }`);
        } else {
            res.status(404).send('Not found');
        }
    });
}));
/**
 * Error handling
 */
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');
app.use((err, req, res, next) => {
    console.log(pe.render(err)); // eslint-disable-line no-console
    const html = ReactDOM.renderToStaticMarkup(React.createElement(Html_1.default, { title: "Internal Server Error", description: err.message }, ReactDOM.renderToString(React.createElement(ErrorPage_1.default, { error: err }))));
    res.status(err.status || 500);
    res.send(`<!doctype html>${ html }`);
});
app.listen(config_1.port, error => {
    /* if (error) {
      console.log(`%s Listening on http://localhost:${port}/`, chalk.red('[Error]'));
      console.log(error);
    } else {*/
    console.log(`Listening on http://localhost:${ config_1.port }/`);
    // }
});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const React = __webpack_require__(0);
class ErrorPage extends React.Component {
    render() {
        if (true) {
            const { error } = this.props;
            return React.createElement("div", null, React.createElement("h1", null, error.name), React.createElement("p", null, error.message), React.createElement("pre", null, error.stack));
        }
        return React.createElement("div", null, React.createElement("h1", null, "Error"), React.createElement("p", null, "Sorry, a critical error occurred on this page."));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorPage;

/***/ }
/******/ ]);
//# sourceMappingURL=main.server.js.map