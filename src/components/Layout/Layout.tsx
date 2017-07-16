import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { IState, IUserState } from '../../redux/IState';
import { AsyncCourseGroupPanel } from '../CourseGroupPanel';
import { AsyncCourseListPanel } from '../CourseListPanel';
import Main from '../Main';
import { AsyncSearchCoursePanel } from '../SearchCoursePanel';
import Sidebar from '../Sidebar';
import SidebarMenu from '../SidebarMenu';
import * as s from './Layout.css';
import NoMatch from './NoMatch';

// TODO not using required
// tslint:disable-next-line:no-var-requires
const MdAdd = require('react-icons/lib/md/add');

namespace Layout {
  export interface IConnectedState {
    user: IUserState;
    expand: {
      left: boolean,
      right: boolean,
    };
    floatingButton: {
      show: boolean,
      to: string,
      icon: string,
    };
  }

  export type Props = IConnectedState;
}

class Layout extends React.Component<Layout.Props> {
  public render() {
    return (
      <div>
        {
          this.props.user && <SidebarMenu key="sidebar-menu"></SidebarMenu>
        }
        <Main expanded={this.props.expand}>
          {this.props.children}
        </Main>
        <Sidebar expanded={this.props.expand.right} right>
          <Switch>
            <Route exact path="/coursetable/:id" component={AsyncCourseListPanel} />
            <Route exact path="/coursetable/:id/search" component={AsyncSearchCoursePanel} />
            <Route exact path="/coursetable/:id/coursegroup/:gid" component={AsyncCourseGroupPanel} />
            <Route path="/" />
          </Switch>
        </Sidebar>
      </div>
    );
  }
}

const mapStateToProps = (state: IState): Layout.IConnectedState => ({
  expand: state.ui.sidebar.expand,
  user: state.user,
  floatingButton: state.ui.floatingButton,
});

export default compose(
  withStyles(s),
  connect(mapStateToProps, {}),
)(Layout);
