import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as MarkGithubIcon from 'react-icons/lib/go/mark-github';
import { defineMessages, FormattedMessage } from 'react-intl';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Navigation } from '../Navigation';
import * as s from './Header.css';

const messages = defineMessages({
  brand: {
    id: 'header.brand',
    defaultMessage: 'Typescript React Starter Kit',
    description: 'Brand name displayed in header',
  },
});

@withStyles(s)
export class Header extends React.Component<{}> {
  render() {
    return (
      <div className={s.root}>
        <div className={s.topnav}>
          <div className={s.left}>
            <LanguageSwitcher />
          </div>
          <div className={s.right}>
            {/* <LanguageSwitcher /> */}
            <span>
              <MarkGithubIcon size={24} />
            </span>
          </div>
        </div>
        <div className={s.title}>
          <div className={s.logo}>
            <svg version="1.1" x="0px" y="0px" viewBox="0 0 400 400" data-reactid=".0.0">
              <circle fill="rgba(255,255,255,0.1)" cx="200" cy="200" r="139" data-reactid=".0.0.0">
              </circle>
              <path
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                d="M231.7,200c0,17.4-1.7,88-31.7,88s-31.7-70.6-31.7-88s1.7-88,31.7-88S231.7,182.6,231.7,200z">
              </path>
              <path
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                // tslint:disable-next-line:max-line-length
                d="M216.1,227.7c-15,8.9-76.6,43.4-91.9,17.6s44.6-63.2,59.6-72.1s76.6-43.4,91.9-17.6S231.1,218.8,216.1,227.7z">
              </path>
              <path
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                // tslint:disable-next-line:max-line-length
                d="M183.9,227.7c15,8.9,76.6,43.4,91.9,17.6s-44.6-63.2-59.6-72.1s-76.6-43.4-91.9-17.6S168.9,218.8,183.9,227.7z">
              </path>
              <circle fill="#FFFFFF" cx="200" cy="200" r="16" data-reactid=".0.0.4"></circle>
            </svg>
          </div>
          {/* {<img className={s.logo} src={logoUrl} srcSet={`${logoUrl2x} 2x`} alt="React" />} */}
          <div className={s.brandTxt}>
            <FormattedMessage {...messages.brand} />
          </div>
        </div>
        <div className={s.navigation}>
          <Navigation />
        </div>
      </div>
    );
  }
}
