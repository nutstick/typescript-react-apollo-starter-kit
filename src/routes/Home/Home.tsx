import * as cx from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import NewsFeed from '../NewsFeed';

interface IHome extends React.Props<any> {
  user: string;
}

class Home extends React.Component<IHome> {
  public render() {
    return (<Route exact path="/" component={NewsFeed} />);
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Home);
