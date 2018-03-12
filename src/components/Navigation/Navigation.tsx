import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as s from './Navigation.css';

const messages = defineMessages({
  getstarted: {
    id: 'navigation.getstarted',
    defaultMessage: 'Get Started',
    description: 'Get Started link in header',
  },
  examples: {
    id: 'navigation.examples',
    defaultMessage: 'Examples',
    description: 'Examples link in header',
  },
  about: {
    id: 'navigation.about',
    defaultMessage: 'About',
    description: 'About link in header',
  },
});

@withStyles(s)
export class Navigation extends React.Component<{}> {
  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/getstarted">
          <FormattedMessage {...messages.getstarted} />
        </Link>
        <Link className={s.link} to="/examples">
          <FormattedMessage {...messages.examples} />
        </Link>
        <Link className={s.link} to="/about">
          <FormattedMessage {...messages.about} />
        </Link>
      </div>
    );
  }
}
