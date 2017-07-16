import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { compose, DefaultChildProps, graphql } from 'react-apollo';
import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as Redux from 'redux';
import { Button } from 'semantic-ui-react';
import { signOut } from '../../redux/user/actions';
import Avartar from '../Avartar';
import Sidebar from '../Sidebar';
import * as logoUrl from './Logo-Black.png';
import * as s from './SidebarMenu.css';
import * as USERQUERY from './UserQuery.gql';

import { IState } from '../../redux/IState';
import { IUser } from '../../schema/types/User';

namespace SidebarMenu {
  export interface IUserQuery {
    me: IUser;
  }

  export interface IConnectedState {
    expanded: boolean;
  }

  export interface IConnectedDispatch {
    onSignOut?: () => void;
  }

  export type Props = DefaultChildProps<IConnectedDispatch & IConnectedState, IUserQuery>;
}

const messages = defineMessages({
  coursetables: {
    id: 'sidebar.menu.coursetables',
    defaultMessage: 'Course Tables',
    description: 'My Course tables menu',
  },
  newsfeed: {
    id: 'sidebar.menu.newsfeed',
    defaultMessage: 'Feed',
    description: 'New feeds',
  },
  courses: {
    id: 'sidebar.menu.courses',
    defaultMessage: 'My Courses',
    description: 'My Courses Menu',
  },
});

// TODO SidebarMenu should extends Sidebar class
class SidebarMenu extends React.Component<SidebarMenu.Props> {
  public render() {
    return (
      <Sidebar className={s.root} expanded={this.props.expanded} left>
        <div className={s.wrap}>
          <div className={s.logoWrapper}>
            <img className={s.logo} src={logoUrl} srcSet={`${logoUrl}`} alt="ChulaCoursetable" />
          </div>
          <div className={s.menu}>
            <nav className={s.nav}>
              <NavLink to="/" activeClassName={s.active}><FormattedMessage {...messages.newsfeed} /></NavLink>
              <NavLink to="/coursetable" activeClassName={s.active}>
                <FormattedMessage {...messages.coursetables} />
              </NavLink>
              <NavLink to="/courses" activeClassName={s.active}><FormattedMessage {...messages.courses} /></NavLink>
            </nav>
          </div>
          <div className={s.profileWrapper}>
            <div className={s.profile}>
              <Avartar
                className={s.avatar}
                src={`${this.props.data.me.avatar}`}
                alt="Profile picture"
                size={60}>
              </Avartar>
              <div className={s.nameWrapper}>
                <div className={s.firstLine}>{this.props.data.me.name}</div>
                <div className={s.secondLine}>{this.props.data.me.faculty}, {this.props.data.me.department}</div>
              </div>
            </div>
            <div className={s.actionHolder}>
              <Button basic color="blue">Edit</Button>
              <Button basic color="blue" onClick={this.props.onSignOut.bind(this)}>Sign out</Button>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  expanded: state.ui.sidebar.expand.left,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<IState>): SidebarMenu.IConnectedDispatch => ({
  onSignOut: () => {
    dispatch(signOut());
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(s),
  graphql<SidebarMenu.IUserQuery, SidebarMenu.Props>(USERQUERY),
)(SidebarMenu);
