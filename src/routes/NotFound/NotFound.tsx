import * as React from 'react';

interface INotFound extends React.Props<any> {
  title: String;
}

export default class NotFound extends React.Component<INotFound, void> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>Sorry, the page you were trying to view does not exist.</p>
      </div>
    );
  }
}
