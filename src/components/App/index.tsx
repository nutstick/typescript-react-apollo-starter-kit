import * as React from 'react';

class App extends React.Component<any, any> {
  public static propTypes = {
    children: React.PropTypes.node,
  };

  public render() {
    return (
      <div>
        <h1>Hello World!</h1>
        {this.props.children}
      </div>
    );
  }
}

export default App;
