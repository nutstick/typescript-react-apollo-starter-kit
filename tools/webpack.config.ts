import * as AssetsPlugin from 'assets-webpack-plugin';
// import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as cssnano from 'cssnano';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { Configuration, Resolve } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as nodeExternals from 'webpack-node-externals';
import * as pkg from '../package.json';
import overrideRules from './lib/overrideRules';

export const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');

// Hard choice here...
// You can enforce this for test environments :-)
const REACT_INTL_ENFORCE_DESCRIPTIONS = false;

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

console.log(path.resolve(__dirname, '../node_modules/react-icons'));

const config: Configuration = {
  context: path.resolve(__dirname, '..'),

  output: {
    path: path.resolve(__dirname, '../dist/public/assets'),
    publicPath: '/assets/',
    pathinfo: isVerbose,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath),
  },

  resolve: {
    // modules: [
    //   path.resolve(__dirname, '../src'),
    //   'node_modules',
    // ],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: ['node_modules', 'src'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
          useCache: true,
          babelOptions: {
            presets: [
              // A Babel preset that can automatically determine the Babel plugins and polyfills
              // https://github.com/babel/babel-preset-env
              [
                'env',
                {
                  targets: {
                    // browsers: pkg.browserslist,
                    // uglify: true,
                    node: 'current',
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
              // Experimental ECMAScript proposals
              // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
              'stage-2',
              // JSX, Flow
              // https://github.com/babel/babel/tree/master/packages/babel-preset-react
              'react',
              // Optimize React code for the production build
              // https://github.com/thejameskyle/babel-react-optimize
              ...(isDebug ? [] : ['react-optimize']),
            ],
            plugins: [
              // Adds component stack to warning messages
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
              ...(isDebug ? [] : ['transform-react-jsx-source']),
              // Adds __self attribute to JSX which React will use for some warnings
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
              ...(isDebug ? [] : ['transform-react-jsx-self']),
              [
                'react-intl',
                {
                  messagesDir: path.resolve(
                    __dirname,
                    '../dist/messages/extracted',
                  ),
                  extractSourceLocation: true,
                  enforceDescriptions: REACT_INTL_ENFORCE_DESCRIPTIONS,
                },
              ],
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /react-icons\/(.)*(.js)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ use: ['isomorphic-style-loader', 'css-loader'] }),
        include: /node_modules/,
        exclude: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'isomorphic-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: isDebug,
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              minimize: isDebug,
              discardComments: { removeAll: true },
              camelCase: 'dashesOnly',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },
        ],
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       `css-loader?${JSON.stringify({ sourceMap: isDebug, minimize: !isDebug })}`,
      //       'postcss-loader?pack=sass',
      //       'sass-loader',
      //     ],
      //   }),
      // },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
          limit: 10000,
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
        },
      },
      {
        test: /\.(graphql|gql)$/,
        // include: [
        //   path.resolve(__dirname, '../src'),
        // ],
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

      // Exclude dev modules from production build
      ...(isDebug
        ? []
        : [
            {
              test: path.resolve(
                __dirname,
                '../node_modules/react-deep-force-update/lib/index.js',
              ),
              loader: 'null-loader',
            },
          ]),
    ],
  },

  bail: !isDebug,
  cache: isDebug,

  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    // cachedAssets: isVerbose,
  },

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'cheap-module-source-map' : 'source-map',
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig: Configuration = {
  ...config,

  name: 'client',
  target: 'web',

  entry: {
    client: ['babel-polyfill', './src/loader.client.ts'],
  },

  // output: {
  //   filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
  //   chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  // },

  plugins: [

    new ExtractTextPlugin('[name].css'),

    // new webpack.LoaderOptionsPlugin({
    //   minimize: !isDebug,
    //   debug: !isDebug,
    // }),

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      '__DEV__': isDebug,
    }),

    // Emit a file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../dist'),
      filename: 'assets.json',
      prettyPrint: true,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => /node_modules/.test(module.resource),
    }),

    ...isDebug ? [] : [
      // Decrease script evaluation time
      // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
      new webpack.optimize.ModuleConcatenationPlugin(),

      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new (webpack as any).optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: isVerbose,
          unused: true,
          dead_code: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),

      new webpack.NormalModuleReplacementPlugin(
        /^\.\.\/routes\/.+$/,
        (resource) => {
          resource.request = `${resource.request}/async`;
        },
      ),
    ],

    // Webpack Bundle Analyzer
    // https://github.com/th0r/webpack-bundle-analyzer
    ...isAnalyze ? [new BundleAnalyzerPlugin()] : [],
  ],

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'cheap-module-source-map' : false,

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig: Configuration = {
  ...config,

  name: 'server',
  target: 'node',

  entry: {
    server: ['babel-polyfill', './src/main.server.tsx'],
  },

  output: {
    ...config.output,
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },

  module: {
    ...config.module,

    rules: overrideRules((config.module as webpack.NewModule).rules, (rule) => {
      // Override babel-preset-env configuration for Node.js
      if (rule.loader === 'awesome-typescript-loader') {
        const x = {
          ...rule,
          options: {
            ...rule.options,
            babelOptions: {
              ...rule.options.babelOptions,
              presets: rule.options.babelOptions.presets.map(
                (preset) =>
                  preset[0] !== 'env'
                    ? preset
                    : [
                        'env',
                        {
                          targets: {
                            node: 'current',
                          },
                          // modules: false,
                          // useBuiltIns: false,
                          // debug: false,
                        },
                      ],
              ),
            },
          },
        };
        return {
          ...rule,
          options: {
            ...rule.options,
            babelOptions: {
              ...rule.options.babelOptions,
              presets: rule.options.babelOptions.presets.map(
                (preset) =>
                  preset[0] !== 'env'
                    ? preset
                    : [
                        'env',
                        {
                          targets: {
                            node: 'current',
                          },
                          modules: false,
                          useBuiltIns: false,
                          debug: false,
                        },
                      ],
              ),
            },
          },
        };
      }

      // Override paths to static assets
      // if (
      //   rule.loader === 'file-loader' ||
      //   rule.loader === 'url-loader' ||
      //   rule.loader === 'svg-url-loader'
      // ) {
      //   return {
      //     ...rule,
      //     options: {
      //       ...rule.options,
      //       name: `public/assets/${rule.options.name}`,
      //       publicPath: (url) => url.replace(/^public/, ''),
      //     },
      //   };
      // }

      return rule;
    }),
  },
  externals: [
    './assets.json',
    nodeExternals({
      whitelist: [/\.(css|less|scss|sss)$/, /\.(bmp|gif|jpe?g|png|svg)$/],
    }),
  ],

  plugins: [

    new ExtractTextPlugin('[name].css'),

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      '__DEV__': isDebug,
    }),

    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.js.org/plugins/banner-plugin/
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),

  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

export default [clientConfig, serverConfig];
