import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Todo.css';

export namespace Todo {
  export interface Props {
    id: number;
    text: string;
    done: boolean;
    onClick: (id: number) => void;
  }
}

@withStyles(s)
export class Todo extends React.Component<Todo.Props> {
  public render() {
    return (
      <div className={s.root}>
        <div
          className={cx(s.toggle, { [s.done]: this.props.done })}
          onClick={() => { this.props.onClick(this.props.id); }}
        ></div>
        <div className={cx(s.text, { [s.done]: this.props.done })}>
          {this.props.text}
        </div>
      </div>
    );
  }
}
