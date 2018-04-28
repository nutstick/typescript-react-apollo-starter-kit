import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as s from './Examples.css';

export namespace Examples {
  export type Props = any;
}

@withStyles(s)
export class Examples extends React.Component<Examples.Props> {
  public render() {
    return <div className={s.root}>
      <div className={s.title}>
        <div className={s.textWrap}>
          Examples
        </div>
      </div>
      <div className={s.content}>
        <ul>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
          <li><Link to="/examples/todo">Todo</Link></li>
        </ul>
      </div>
    </div>;
  }
}
