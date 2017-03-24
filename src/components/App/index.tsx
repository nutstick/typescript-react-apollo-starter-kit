import * as React from 'react';
import * as deepForceUpdate from 'react-deep-force-update';
import { IntlProvider } from 'react-intl';

interface IContext {
  insertCss: any;
  store: {
    subscribe: any;
    dispatch: any;
    getState: any;
  };
  client: any;
}

interface IAppProps {
  context: IContext;
  children?: any;
}

class App extends React.Component<IAppProps, any> {
  context: IContext;
  unsubscribe: () => void;
  intl: {
    initialNow?: string,
    locale?: string,
    messages?: string,
  };

  static childContextTypes = {
    insertCss: React.PropTypes.func.isRequired,
    // Integrate Redux
    // http://redux.js.org/docs/basics/UsageWithReact.html
    store: React.PropTypes.shape({
      subscribe: React.PropTypes.func.isRequired,
      dispatch: React.PropTypes.func.isRequired,
      getState: React.PropTypes.func.isRequired,
    }).isRequired,
    // Apollo Client
    client: React.PropTypes.object.isRequired,
  };

  public getChildContext() {
    return this.props.context;
  }

  public componentDidMount() {
    const store = this.props.context && this.props.context.store;
    if (store) {
      this.unsubscribe = store.subscribe(() => {
        const state = store.getState();
        const newIntl = state.intl;
        if (this.intl !== newIntl) {
          this.intl = newIntl;
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('Intl changed — Force rendering');
          }
          deepForceUpdate(this);
        }
      });
    }
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  public render() {
    const store = this.props.context && this.props.context.store;
    const state = store && store.getState();
    this.intl = (state && state.intl) || {};
    const { initialNow, locale, messages } = this.intl;
    const localeMessages = (messages && messages[locale]) || {};

    return (
      <IntlProvider
        initialNow={initialNow}
        locale={locale}
        messages={localeMessages}
        defaultLocale="en-US"
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

export default App;
