import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Link from '../Link';
import * as s from './Navigation.css';

const messages = defineMessages({
  about: {
    id: 'navigation.about',
    defaultMessage: 'About',
    description: 'About link in header',
  },
  contact: {
    id: 'navigation.contact',
    defaultMessage: 'Contact',
    description: 'Contact link in header',
  },
  login: {
    id: 'navigation.login',
    defaultMessage: 'Log in',
    description: 'Log in link in header',
  },
  or: {
    id: 'navigation.separator.or',
    defaultMessage: 'or',
    description: 'Last separator in list, lowercase "or"',
  },
  signup: {
    id: 'navigation.signup',
    defaultMessage: 'Sign up',
    description: 'Sign up link in header',
  },
});

class Navigation extends React.Component<void, void> {
  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">
          <FormattedMessage {...messages.about} />
        </Link>
        <Link className={s.link} to="/contact">
          <FormattedMessage {...messages.contact} />
        </Link>
        <span className={s.spacer}> | </span>
        <Link className={s.link} to="/login">
          <FormattedMessage {...messages.login} />
        </Link>
        <span className={s.spacer}>
          <FormattedMessage {...messages.or} />
        </span>
        <Link className={cx(s.link, s.highlight)} to="/register">
          <FormattedMessage {...messages.signup} />
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
