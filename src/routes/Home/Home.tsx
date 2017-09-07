import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from '../../redux/connect';
import { MapStateToProps } from '../../redux/reducers';
import { IUserState } from '../../redux/user/reducers';
import * as s from './Home.css';

export namespace Home {
  export interface IConnectState {
    user: IUserState;
  }

  export type Props = IConnectState;
}

const mapStateToProps: MapStateToProps<Home.Props, Home.IConnectState> = (state) => ({
  user: state.user,
});

@withStyles(s)
@connect(mapStateToProps)
export class Home extends React.Component<Home.Props> {
  public render() {
    return (<h2>Home Page</h2>);
  }
}
