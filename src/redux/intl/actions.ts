import ApolloClient from 'apollo-client';
import { IntlProvider } from 'react-intl';
import { Dispatch } from 'react-redux';
import { State } from '../';
import * as constants from './constants';
import queryIntl from './intl.gql';

interface IQueryIntl {
  intl: Array<{
    id: string,
    message: string,
  }>;
}

export type ISetLocale = (dispatch: Dispatch<State>, getState: () => void, context: { client: ApolloClient }) => any;

export interface ISetLocaleStart {
  type: constants.SET_LOCALE_START,
  payload: {
    locale: string,
  };
}

export interface ISetLocaleSuccess {
  type: constants.SET_LOCALE_SUCCESS;
  payload: {
    locale: string,
    messages: {
      [key: string]: string;
    },
  };
}

export interface ISetLocaleError {
  type: constants.SET_LOCALE_ERROR;
  payload: {
    locale: string,
    error: Error,
  };
}

export type IntlAction = ISetLocaleStart | ISetLocaleSuccess | ISetLocaleError;

function getIntlFromState(state) {
  const intl = (state && state.intl) || {};
  const { initialNow, locale, messages } = intl;
  const localeMessages = (messages && messages[locale]) || {};
  const provider = new IntlProvider({
    initialNow,
    locale,
    messages: localeMessages,
    defaultLocale: 'en-US',
  });
  return provider.getChildContext().intl;
}

export function getIntl() {
  return (dispatch, getState) => getIntlFromState(getState());
}

export function setLocale({ locale }): ISetLocale {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: constants.SET_LOCALE_START,
      payload: {
        locale,
      },
    });

    try {
      const { data } = await client.query<IQueryIntl>({ query: queryIntl, variables: { locale }});
      const messages = data.intl.reduce((msgs, msg) => {
        msgs[msg.id] = msg.message; // eslint-disable-line no-param-reassign
        return msgs;
      }, {});
      dispatch({
        type: constants.SET_LOCALE_SUCCESS,
        payload: {
          locale,
          messages,
        },
      });

      // remember locale for every new request
      if (process.env.BROWSER) {
        const maxAge = 3650 * 24 * 3600; // 10 years in seconds
        document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
      }

      // return bound intl instance at the end
      return getIntlFromState(getState());
    } catch (error) {
      dispatch({
        type: constants.SET_LOCALE_ERROR,
        payload: {
          locale,
          error,
        },
      });
      return null;
    }
  };
}
