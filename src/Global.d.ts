/// <reference types="react" />
/**
 * Type declerations for global development variables
 */

// import { ComponentClass, StatelessComponent } from 'react';

declare var global: any;

declare var __DEV__: boolean;

declare interface Window {
  // A hack for the Redux DevTools Chrome extension.
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
  __INITIAL_STATE__?: any;
  __APOLLO_STATE__?: any;
  devToolsExtension?: any;
  Intl?: any;
  ga: any;
  RSK_ENTRY: any;
  App: {
    apiUrl: string,
    state: any,
    lang: string,
  };
}

interface NodeModule {
  hot?: any;
}

declare module 'write-file-webpack-plugin' {
  const _: any;
  export = _;
}

declare module 'gaze' {
  const _: any;
  export = _;
}

// tslint:disable-next-line
// interface ObjectConstructor {
//   assign(target: any, ...sources: any[]): any;
// }

declare module '*.gql' {
  const _: DocumentNode;
  export = _;
 }

declare module '*.json' {
  const _: any;
  export = _;
}

declare module '*.css' {
  const _: any;
  export = _;
}

declare module '*.jpg' {
  const _: any;
  export = _;
}

declare module '*.png' {
  const _: any;
  export = _;
}

declare module 'isomorphic-style-loader/lib/withStyles' {
  export declare type CompositeComponent<P> = React.ComponentClass<P> | React.StatelessComponent<P>;
  // export interface ComponentDecorator<TOwnProps> {
  //   (component: CompositeComponent<TOwnProps>): ComponentClass<TOwnProps>;
  // }
  export type ComponentDecorator<TOwnProps> = (component: CompositeComponent<TOwnProps>) => ComponentClass<TOwnProps>;
  export default function withStyles<TProps = {}>(styles?: any): ComponentDecorator<TProps>;
}
