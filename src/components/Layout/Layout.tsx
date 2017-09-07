import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link, Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from '../../redux/connect';
import { IUserState } from '../../redux/user/reducers';
import { Header } from '../Header';
import { Main } from '../Main';
import NoMatch from './NoMatch';

import * as s from './Layout.css';

// TODO not using required
// tslint:disable-next-line:no-var-requires
const MdAdd = require('react-icons/lib/md/add');

namespace Layout {
  export interface IConnectState {
    user: IUserState;
  }

  export interface IProps extends React.Props<any> {
    test: string;
  }

  export type Props = IConnectState & IProps;
}

const mapStateToProps = (state: any, ownProps: Layout.IProps) => ({
  user: state.user,
});

// @withStyles(s)
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

export default compose(
  withStyles(s),
  connect(mapStateToProps),
)(Layout);
