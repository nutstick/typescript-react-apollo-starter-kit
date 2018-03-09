import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Todos.css';

export namespace Todos {
  export type Props = any;
}

@withStyles(s)
export class Todos extends React.Component<Todos.Props> {
  public render() {
    return <div className={s.root}>
      <h4>Todos</h4>
      <div>
      </div>
    </div>;
  }
}
