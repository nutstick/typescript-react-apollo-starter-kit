/**
 * Type declerations for global development variables
 */
declare var __DEV__: boolean;

interface Window {
  // A hack for the Redux DevTools Chrome extension.
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
  __INITIAL_STATE__?: any;
  __APOLLO_STATE__?:any;
  devToolsExtension?: any;
  Intl?: any;
  ga: any;
}

interface NodeModule {
  hot?: any;
}

declare function _import<T>(path: string): Promise<T>;

declare module 'react-router-scroll' {
  var _: any;
  export = _;
}

declare module 'write-file-webpack-plugin' {
  var _: any;
  export = _;
}

declare module 'gaze' {
  var _: any;
  export = _;
}

interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
}

declare module '*.graphql' {
  var _: string;
  export = _;
  // export default  _;
}

declare module '*.gql' {
  var _: string;
  export = _;
  // export default  _;
}

declare module '*.json' {
  var _: any;
  export = _;
}

declare module '*.css' {
  var _: any;
  export = _;
}

declare module '*.png' {
  var _: any;
  export = _;
}
