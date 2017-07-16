import * as React from 'react';

export namespace ErrorPage {
  export interface IProps extends React.Props<any> {
    error: { name, message, stack };
  }

  export type Props = IProps;
}

export default class ErrorPage extends React.Component<ErrorPage.Props> {
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
