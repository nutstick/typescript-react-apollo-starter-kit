import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from '../../redux/connect';

namespace LanguageProvider {
  export interface IProps {
    messages: Map<string, string>;
    children: React.ReactNode;
  }

  export interface IConnectedState {
    locale: string;
  }

  export type Props = IProps & IConnectedState;
}

const mapStateToProps = (state): LanguageProvider.IConnectedState => ({
  locale: state.intl.locale,
});

@connect(mapStateToProps)
export default class LanguageProvider extends React.Component<LanguageProvider.Props> {
  public render() {
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}
