import * as AssetsPlugin from 'assets-webpack-plugin';
// import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as cssnano from 'cssnano';
import * as extend from 'extend';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { Configuration, Resolve } from 'webpack';

const INTL_REQUIRE_DESCRIPTIONS = true;

export const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config: Configuration = {
  context: path.resolve(__dirname, '../src'),

  output: {
    path: path.resolve(__dirname, '../dist/public/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
  },

  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        loaders: [
          'babel-loader',
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            // CSS Loader https://github.com/webpack/css-loader
            importLoaders: 1,
            sourceMap: isDebug,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
            // CSS Nano http://cssnano.co/options/
            minimize: !isDebug,
          })}`,
          'postcss-loader?pack=default',
        ],
      },
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            `css-loader?${JSON.stringify({ sourceMap: isDebug, minimize: !isDebug })}`,
            'postcss-loader?pack=sass',
            'sass-loader',
          ],
        }),
      },
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
        include: [
          path.resolve(__dirname, '../src'),
        ],
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
  entry: {
    client: './main.client.tsx',
  },

  output: {
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },

  target: 'web',

  plugins: [

    new ExtractTextPlugin('[name].css'),

    new (webpack as any).LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnano({
            autoprefixer: {
              browsers: [
                'safari 9',
                'ie 10-11',
                'last 2 Chrome versions',
                'last 2 Firefox versions',
                'edge 13',
                'ios_saf 9.0-9.2',
                'ie_mob 11',
                'Android >= 4',
              ],
              cascade: false,
              add: true,
              remove: true,
            },
            safe: true,
          }),
        ],
      },
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
      filename: 'assets.js',
      processOutput: (x) => `module.exports = ${JSON.stringify(x)};`,
    }),

    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 50000,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),

    ...isDebug ? [] : [
      // Search for equal or similar files and deduplicate them in the output
      // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      new webpack.optimize.DedupePlugin(),
    ],
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
  entry: {
    server: './main.server.tsx',
  },

  output: {
    filename: '../../main.server.js',
    libraryTarget: 'commonjs2',
  },

  target: 'node',

  externals: [
    /^\.\/assets$/,
    (context, request, callback) => {
      const isExternal =
        request.match(/^[@a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/\.(css|less|scss|sss)$/i);
      callback(null, Boolean(isExternal));
    },
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
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    // new webpack.BannerPlugin('require("source-map-support").install();',
    //   { raw: true, entryOnly: false }),
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
