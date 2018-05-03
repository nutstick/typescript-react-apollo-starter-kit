import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Navigation } from '../Navigation';
import * as s from './Header.css';

namespace Header {
  export interface Props {}
}

@withStyles(s)
export class Header extends React.Component<Header.Props> {
  render() {
    return (<div className={cx(s.root)}>
      <Navigation />
    </div>);
  }
}
