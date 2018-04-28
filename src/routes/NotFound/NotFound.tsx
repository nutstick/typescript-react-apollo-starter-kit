import * as React from 'react';
import * as s from './NotFound.css';

interface INotFound extends React.Props<any> {
  title: string;
}

export class NotFound extends React.Component<INotFound> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root} style={{ padding: '3rem' }}>
        <h1 className={s.header}>404 Page not found</h1>
        <p className={s.content}>Sorry, the page you were trying to view does not exist.</p>
      </div>
    );
  }
}
