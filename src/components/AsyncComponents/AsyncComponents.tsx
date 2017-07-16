import * as React from 'react';
// import { asyncComponent } from 'react-async-component';

interface IAsyncComponentState {
  Component?: any;
}

// export const asyncRoute = (getComponent: () => Promise<any>) => asyncComponent({
//   resolve: getComponent,
// });

export const asyncRoute = (getComponent: () => Promise<any>) => (
  class AsyncComponent extends React.Component<any, IAsyncComponentState> {
    static Component?: any = null;

    private mounted: boolean;

    public state = {
      Component: AsyncComponent.Component,
    };

    public componentWillMount() {
      if ( this.state.Component === null ) {
        getComponent().then((m) => m.default).then((Component) => {
          AsyncComponent.Component = Component;

          if ( this.mounted ) {
            this.setState({ Component });
          } else {
            this.state.Component = Component;
          }
        });
      }
    }

    public componentDidMount() {
      this.mounted = true;
    }

    public componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { Component } = this.state;

      if (Component !== null && process.env.BROWSER) {
        return (<Component {...this.props} />);
      }
      return null;
    }
  }
);
