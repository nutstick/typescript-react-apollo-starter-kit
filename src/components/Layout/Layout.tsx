import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import Header from '../Header';
import * as s from './Layout.css';

interface ILayoutProps extends React.Props<any> {}

class Layout extends React.Component<ILayoutProps, void> {
  public render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(s)(Layout);
