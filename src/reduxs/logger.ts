import { createLogger } from 'redux-logger';
import { inspect } from 'util';

function inspectObject(object) {
  return inspect(object, {
    colors: true,
  });
}

function singleLine(str) {
  return str.replace(/\s+/g, ' ');
}

const actionFormatters = {
  // This is used at feature/apollo branch, but it can help you when implementing Apollo
  APOLLO_QUERY_INIT: (a) =>
    `queryId:${a.queryId} variables:${inspectObject(
      a.variables,
    )}\n   ${singleLine(a.queryString)}`,

  APOLLO_QUERY_RESULT: (a) =>
    `queryId:${a.queryId}\n   ${singleLine(inspectObject(a.result))}`,

  APOLLO_QUERY_STOP: (a) => `queryId:${a.queryId}`,

  SET_LOCALE_SUCCESS: (a) =>
    `locale ${a.payload.locale}: ${Object.keys(a.payload.messages)
      .length} messages`,
};

let logger;
if (process.env.BROWSER) {
  logger = () => {
    return createLogger({
      collapsed: true,

      stateTransformer: (state) => {
        return state.toJS ? state.toJS() : state;
      },
      predicate: (getState, { type }) => {
        return type !== 'redux-form/BLUR' &&
              type !== 'redux-form/CHANGE' &&
              type !== 'redux-form/FOCUS' &&
              type !== 'redux-form/TOUCH';
      },
    });
  };
} else {
  logger = () => {
    return (store) => (next) => (action) => {
      let formattedPayload = '';
      const actionFormatter = actionFormatters[action.type];
      if (typeof actionFormatter === 'function') {
        formattedPayload = actionFormatter(action);
      } else if (action.toString !== Object.prototype.toString) {
        formattedPayload = action.toString();
      } else if (typeof action.payload !== 'undefined') {
        formattedPayload = inspectObject(action.payload);
      } else {
        formattedPayload = inspectObject(action);
      }

      // tslint:disable-next-line:no-console
      console.log(` * ${action.type}: ${formattedPayload}`);
      return next(action);
    };
  };
}

export default logger;
