import * as React from 'react';

interface IErrorPage extends React.Props<any> {
  error: { name, message, stack };
}

class ErrorPage extends React.Component<IErrorPage, void> {
  public render() {
    if (process.env.NODE_ENV !== 'production') {
      const { error } = this.props;
      return (
        <div>
          <h1>{error.name}</h1>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      );
    }

    return (
      <div>
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </div>
    );
  }
}

export default ErrorPage;
