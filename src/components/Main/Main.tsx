import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Main.css';

@withStyles(s)
export class Main extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={s.root}>
        {this.props.children}
      </div>
    );
  }
}
