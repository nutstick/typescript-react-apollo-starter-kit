import * as AssetsPlugin from 'assets-webpack-plugin';
// import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as cssnano from 'cssnano';
import * as extend from 'extend';
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
  context: path.resolve(__dirname, '../src'),

  output: {
    path: path.resolve(__dirname, '../dist/public/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
    pathinfo: isVerbose,
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
          useCache: true,
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
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules',
    ],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
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

};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig: Configuration = extend(true, {}, config, {
  name: 'client',

  entry: {
    client: ['babel-polyfill', './main.client.tsx'],
  },

  output: {
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },

  target: 'web',

  plugins: [

    new ExtractTextPlugin('[name].css'),

    new webpack.LoaderOptionsPlugin({
      minimize: !isDebug,
      debug: !isDebug,
    }),

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
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig: Configuration = extend(true, {}, config, {
  name: 'server',

  entry: {
    server: ['babel-polyfill', './main.server.tsx'],
  },

  output: {
    filename: '../../main.server.js',
    libraryTarget: 'commonjs2',
  },

  target: 'node',

  // module: {
  //   ...config.module,

  //   rules: overrideRules((config.module as webpack.NewModule).rules, (rule) => {
  //     // Override babel-preset-env configuration for Node.js
  //     if (rule.loader === 'awesome-typescript-loader') {
  //       return {
  //         ...rule,
  //         options: {
  //           ...rule.options,
  //           babelOptions: {
  //             ...rule.options.babelOptions,
  //             presets: rule.options.babelOptions.presets.map(
  //               (preset) =>
  //                 preset[0] !== 'env'
  //                   ? preset
  //                   : [
  //                       'env',
  //                       {
  //                         targets: {
  //                           node: pkg.engines.node.match(/(\d+\.?)+/)[0],
  //                         },
  //                         modules: false,
  //                         useBuiltIns: false,
  //                         debug: false,
  //                       },
  //                     ],
  //             ),
  //           },
  //         },
  //       };
  //     }

  //     // Override paths to static assets
  //     // if (
  //     //   rule.loader === 'file-loader' ||
  //     //   rule.loader === 'url-loader' ||
  //     //   rule.loader === 'svg-url-loader'
  //     // ) {
  //     //   return {
  //     //     ...rule,
  //     //     options: {
  //     //       ...rule.options,
  //     //       name: `public/assets/${rule.options.name}`,
  //     //       publicPath: (url) => url.replace(/^public/, ''),
  //     //     },
  //     //   };
  //     // }

  //     return rule;
  //   }),
  // },
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
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

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

  devtool: isDebug ? 'cheap-module-source-map' : 'source-map',
});

export default [clientConfig, serverConfig];
