import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
// import LanguageSwitcher from '../LanguageSwitcher';
import { Link } from '../Link';
import { Navigation } from '../Navigation';
import * as s from './Header.css';
import * as logoUrl from './logo-small.png';
import * as logoUrl2x from './logo-small@2x.png';

const messages = defineMessages({
  brand: {
    id: 'header.brand',
    defaultMessage: 'Your Company Brand',
    description: 'Brand name displayed in header',
  },
  bannerTitle: {
    id: 'header.banner.title',
    defaultMessage: 'Reacts',
    description: 'Title in page header',
  },
  bannerDesc: {
    id: 'header.banner.descsss',
    defaultMessage: 'Complex web apps made easy',
    description: 'Description in header',
  },
});

@withStyles(s)
export class Header extends React.Component<{}> {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation />
          <Link className={s.brand} to="/">
            {<img src={logoUrl} srcSet={`${logoUrl2x} 2x`} width="38" height="38" alt="React" />}
            <span className={s.brandTxt}>
              <FormattedMessage {...messages.brand} />
            </span>
          </Link>
          {/* <LanguageSwitcher /> */}
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>
              <FormattedMessage {...messages.bannerTitle} />
            </h1>
            <FormattedMessage tagName="p" {...messages.bannerDesc} />
          </div>
        </div>
      </div>
    );
  }
}
