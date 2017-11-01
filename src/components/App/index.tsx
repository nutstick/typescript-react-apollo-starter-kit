import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';

namespace App {
  export interface Context {
    insertCss: any;
    fetch: any;
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
    // Apollo Client
    client: PropTypes.object.isRequired,
    // ReactIntl
    intl: IntlProvider.childContextTypes.intl,
  };

  public getChildContext() {
    return this.props.context;
  }

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
