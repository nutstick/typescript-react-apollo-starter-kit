import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';

namespace App {
  export interface Context {
    insertCss: any;
    store: {
      subscribe: any;
      dispatch: any;
      getState: any;
    };
    client: any;
    intl: any;
  }

  interface IProps extends React.Props<any> {
    context: Context;
  }

  export type Props = IProps;
}

class App extends React.Component<App.Props> {
  context: App.Context;
  unsubscribe: () => void;
  intl: {
    initialNow?: string,
    locale?: string,
    messages?: string,
  };

  static childContextTypes = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: PropTypes.func.isRequired,
    // Universal HTTP client
    fetch: PropTypes.func.isRequired,
    // Integrate Redux
    // http://redux.js.org/docs/basics/UsageWithReact.html
    ...(ReduxProvider as any).childContextTypes,
    // Apollo Client
    client: PropTypes.object.isRequired,
    // ReactIntl
    intl: IntlProvider.childContextTypes.intl,
  };

  public getChildContext() {
    return this.props.context;
  }

  // public componentDidMount() {
  //   const store = this.props.context && this.props.context.store;
  //   if (store) {
  //     this.unsubscribe = store.subscribe(() => {
  //       const state = store.getState();
  //       const newIntl = state.intl;
  //       if (this.intl !== newIntl) {
  //         this.intl = newIntl;
  //         if (__DEV__) {
  //           console.log('Intl changed — Force rendering');
  //         }
  //         deepForceUpdate(this);
  //       }
  //     });
  //   }
  // }

  // public componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //     this.unsubscribe = null;
  //   }
  // }

  // public render() {
  //   const store = this.props.context && this.props.context.store;
  //   const client = this.props.context && this.props.context.client;
  //   const state = store && store.getState();
  //   this.intl = (state && state.intl) || {};
  //   const { initialNow, locale, messages } = this.intl;
  //   const localeMessages = (messages && messages[locale]) || {};
  //   return (
  //     <IntlProvider
  //       initialNow={initialNow}
  //       locale={locale}
  //       messages={localeMessages}
  //       defaultLocale="en-US"
  //     >
  //       {React.Children.only(this.props.children)}
  //     </IntlProvider>
  //   );
  // }
  render() {
    // Here, we are at universe level, sure? ;-)
    const { client } = this.props.context;
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return (
      <ApolloProvider client={client}>
        {this.props.children}
      </ApolloProvider>
    );
  }
}

export default App;
