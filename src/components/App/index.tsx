import { ApolloClient } from 'apollo-client';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import * as IntlQuery from '../../apollo/intl/IntlQuery.gql';
import * as LocaleQuery from '../../apollo/intl/LocaleQuery.gql';

namespace App {
  export interface Context {
    // TODO: define type
    insertCss: any;
    client: ApolloClient<any>;
    intl: any;
  }

  interface IProps extends React.Props<any> {
    context: Context;
  }

  export type Props = IProps;

  export interface State {
    // TODO: define type
    intl: any;
  }
}

class App extends React.Component<App.Props> {
  context: App.Context;
  unsubscribe: () => void;
  intl: {
    initialNow?: string,
    locale?: string,
    messages?: string,
  };

  constructor(props) {
    super(props);

    this.state = {
      intl: props.context.intl,
    };
  }

  static childContextTypes = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: PropTypes.func.isRequired,
    // Apollo Client
    client: PropTypes.object.isRequired,
    // ReactIntl
    intl: IntlProvider.childContextTypes.intl,
  };

  public getChildContext() {
    return {
      ...this.props.context,
      ...this.state,
    };
  }

  public componentDidMount() {
    const s = this.setState.bind(this);
    const { client } = this.props.context;

    this.unsubscribe = client.watchQuery<LocaleQuery.Query>({
      query: LocaleQuery,
    }).subscribe({
      next({ data }) {
        const { locale, initialNow } = data;
        // TODO: fetchPolicy network-only to manage some way
        client.query<IntlQuery.Query>({
          query: IntlQuery,
          variables: { locale },
          fetchPolicy: 'network-only',
        })
          .then(({ data: x }) => {
            const messages = x.intl.reduce((msgs, msg) => {
              msgs[msg.id] = msg.message;
              return msgs;
            }, {});

            s({
              intl: new IntlProvider({
                initialNow,
                locale,
                messages,
                defaultLocale: 'en-US',
              }).getChildContext().intl,
            });
          });
      },
    }).unsubscribe;
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  render() {
    const { client } = this.props.context;

    return (
      <ApolloProvider client={client}>
        {this.props.children}
      </ApolloProvider>
    );
  }
}

export default App;
