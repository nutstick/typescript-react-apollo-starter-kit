import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Home.css';

export namespace Home {
  export type Props = any;
}

@withStyles(s)
export class Home extends React.Component<Home.Props> {
  public render() {
    return <h2>
      Home Page
    </h2>;
  }
}
