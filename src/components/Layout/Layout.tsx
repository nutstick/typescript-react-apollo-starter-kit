import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { connect } from 'react-redux';
import { Header } from '../Header';
import { Main } from '../Main';

import * as s from './Layout.css';

namespace Layout {
  export type Props = any;
}

@withStyles(s)
export class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div>
        <Header />
        <Main>
          {this.props.children}
        </Main>
      </div>
    );
  }
}
