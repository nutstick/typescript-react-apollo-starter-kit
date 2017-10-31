import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { compose } from 'redux';
import { State } from '../../reduxs';
import { UserState } from '../../reduxs/user/reducers';
import * as s from './Home.css';

export namespace Home {
  export interface IConnectState {
    user: UserState;
  }

  export type Props = IConnectState;
}

const mapStateToProps = ({ user }: State) => ({
  user,
});

export class Home extends React.Component<Home.Props> {
  public render() {
    return <h2>
      Home Page
    </h2>;
  }
}

const WithStylesHome = withStyles(s)(Home);
export default connect(mapStateToProps)(Home);
