import * as cx from 'classnames';
import * as H from 'history';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as MarkGithubIcon from 'react-icons/lib/go/mark-github';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link, match, withRouter } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';
import * as s from './Navigation.css';

namespace Navigation {
  export interface RouteComponentProps<P> {
    match?: match<P>;
    location?: H.Location;
    history?: H.History;
    staticContext?: any;
  }
  export interface Props extends RouteComponentProps<any> {

  }

  export interface State {
    sticky: boolean;
  }
}

const messages = defineMessages({
  logo: {
    id: 'navigation.logo',
    defaultMessage: 'TRQL',
    description: 'Application Logo',
  },
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

@(withRouter as any)
@withStyles(s)
export class Navigation extends React.Component<Navigation.Props, Navigation.State> {
  constructor(props) {
    super(props);

    this.state = {
      sticky: false,
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  private onScroll(event) {
    if (event.target.documentElement.scrollTop >= 55) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  render() {
    return (
      <div className={cx(s.root, {
        [s.sticky]: this.state.sticky,
        [s.home]: this.props.location.pathname === '/',
      })} role="navigation">
        <ul className={s.left}>
          <li>
            <Link className={s.link} to="/">
              <FormattedMessage {...messages.logo} />
            </Link>
          </li>
        </ul>
        <ul className={s.right}>
          <li>
            <Link className={s.link} to="/getstarted">
              <FormattedMessage {...messages.getstarted} />
            </Link>
          </li>
          <li>
            <Link className={s.link} to="/examples">
              <FormattedMessage {...messages.examples} />
            </Link>
          </li>
          <li>
            <Link className={s.link} to="/about">
              <FormattedMessage {...messages.about} />
            </Link>
          </li>
          <li>
            <LanguageSwitcher />
          </li>
          <li>
            <a href="https://www.github.com/nutstick/typescript-react-apollo-starter-kit">
              <MarkGithubIcon size={24} />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
