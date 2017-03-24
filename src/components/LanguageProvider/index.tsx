import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

interface IProps {
  locale: string;
  messages: Map<string, string>;
  children: React.ReactNode;
}

export class LanguageProvider extends React.Component<IProps, {}> {
  public render() {
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  locale: state.intl.locale,
});

export default connect(mapStateToProps)(LanguageProvider);
