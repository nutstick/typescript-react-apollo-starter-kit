import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Sidebar.css';

export namespace Sidebar {
  export interface IProps extends React.Props<any> {
    className?: string;
    expanded: boolean;
    left?: boolean;
    right?: boolean;
  }

  export type Props = IProps;
}

@withStyles(s)
export class Sidebar extends React.Component<Sidebar.Props> {
  render() {
    return (
      <div className={cx(this.props.className, s.root, {
        [s.expanded]: this.props.expanded,
        [s.left]: this.props.left,
        [s.right]: this.props.right,
      })}>
        {this.props.children}
      </div>
    );
  }
}
