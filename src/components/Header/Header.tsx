import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Link } from '../Link';
import { Navigation } from '../Navigation';
import * as s from './Header.css';
import * as logoUrl from './logo-small.png';
import * as logoUrl2x from './logo-small@2x.png';

const messages = defineMessages({
  brand: {
    id: 'header.brand',
    defaultMessage: 'Typescript React Starter Kit',
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
    // return (
    //   <div className={s.root}>
    //     <div className={s.container}>
    //       <Navigation />
    //       <Link className={s.brand} to="/">
    //         {<img src={logoUrl} srcSet={`${logoUrl2x} 2x`} width="38" height="38" alt="React" />}
    //         <span className={s.brandTxt}>
    //           <FormattedMessage {...messages.brand} />
    //         </span>
    //       </Link>
    //       {/* <LanguageSwitcher /> */}
    //       <div className={s.banner}>
    //         <h1 className={s.bannerTitle}>
    //           <FormattedMessage {...messages.bannerTitle} />
    //         </h1>
    //         <FormattedMessage tagName="p" {...messages.bannerDesc} />
    //       </div>
    //     </div>
    //   </div>
    // );
    return (
      <div className={s.root}>
        <div className={s.topnav}>
          <div className={s.left}>
            <LanguageSwitcher />
          </div>
          <div className={s.right}>
            {/* <LanguageSwitcher /> */}
            <span>test2</span>
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
