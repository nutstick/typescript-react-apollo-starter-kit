import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { HelloWorldQuery } from '../../apollo/helloworld/HelloWorldQuery';
import * as s from './Home.css';

export namespace Home {
  export type Props = any;
}

@withStyles(s)
export class Home extends React.Component<Home.Props> {
  public render() {
    return <HelloWorldQuery query={HelloWorldQuery.query}>
      {({ loading, error, data }) => {
        return loading ? 'Loading' : data.helloworld;
      }}
    </HelloWorldQuery>;
  }
}
