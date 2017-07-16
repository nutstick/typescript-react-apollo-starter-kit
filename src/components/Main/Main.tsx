import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Main.css';

interface IMainProps extends React.Props<any> {
  expanded: {
    left: boolean,
    right: boolean,
  };
}

class Main extends React.Component<IMainProps, void> {
  public render() {
    return (
      <div className={cx(s.root, {
          [s.expandedLeft]: this.props.expanded.left,
          [s.expandedRight]: this.props.expanded.right,
        })}>
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(s)(Main);
