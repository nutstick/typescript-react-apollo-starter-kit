import * as React from 'react';

interface IHome extends React.Props<any> {
  title: String;
}

export default class Home extends React.Component<IHome, void> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>Homepage</p>
      </div>
    );
  }
}
