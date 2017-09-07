import * as AssetsPlugin from 'assets-webpack-plugin';
// import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as cssnano from 'cssnano';
import * as extend from 'extend';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as nodeExternals from 'webpack-node-externals';
import * as pkg from '../package.json';
import overrideRules from './lib/overrideRules';

const INTL_REQUIRE_DESCRIPTIONS = true;

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

const staticAssetName = isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]';

// Hard choice here...
// You can enforce this for test environments :-)
const REACT_INTL_ENFORCE_DESCRIPTIONS = false;

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  context: path.resolve(__dirname, '..'),

  output: {
    path: path.resolve(__dirname, '../dist/public/assets'),
    publicPath: '/assets/',
    pathinfo: isVerbose,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
    ? '[name].chunk.js'
    : '[name].[chunkhash:8].chunk.js',
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath),
  },

  resolve: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // Keep in sync with .flowconfig and .eslintrc
    modules: ['node_modules', 'src'],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,

    rules: [
      // Rules for TS / TSX
      {
        test: /\.ts(x?)$/,
        loader: 'awesome-typescript-loader',
        include: path.resolve(__dirname, '../src'),
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
                    browsers: pkg.browserslist,
                    uglify: true,
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
              ...(isDebug ? ['transform-react-jsx-source'] : []),
              // Adds __self attribute to JSX which React will use for some warnings
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
              ...(isDebug ? ['transform-react-jsx-self'] : []),
              [
                'react-intl',
                {
                  messagesDir: path.resolve(
                    __dirname,
                    '../build/messages/extracted',
                  ),
                  extractSourceLocation: true,
                  enforceDescriptions: REACT_INTL_ENFORCE_DESCRIPTIONS,
                },
              ],
            ],
          },
        },
      },
      {
        test: /react-icons\/(.)*(.js)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },

      // Rules for GraphQL
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract({ use: ['style-loader', 'css-loader'] }),
      //   include: /node_modules/,
      //   exclude: path.resolve(__dirname, '../src'),
      // },
      {
        test: /\.css$/,
        rules: [
          // Convert CSS into JS module
          {
            issuer: { not: [/\.(css|less|scss|sss)$/] },
            use: 'isomorphic-style-loader',
          },
          // Process external/third-party styles
          {
            exclude: path.resolve(__dirname, '../src'),
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              minimize: !isDebug,
              discardComments: { removeAll: true },
            },
          },
          // Process internal/project styles (from src folder)
          {
            include: path.resolve(__dirname, '../src'),
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDebug
                ? '[name]-[local]-[hash:base64:5]'
                : '[hash:base64:5]',
              // CSS Nano http://cssnano.co/options/
              minimize: !isDebug,
              discardComments: { removeAll: true },
            },
          },

          // Apply PostCSS plugins including autoprefixer
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },
        ],
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
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: /\.(css|less|scss|sss)$/,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
            },
          },
        ],
      },

      // Convert plain text into JS module
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },

      // Convert Markdown into HTML
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, './lib/markdown-loader.js'),
      },

      {
        exclude: [
          /\.ts(x?)$/,
          /\.(css|less|scss|sss)$/,
          /\.(bmp|gif|jpe?g|png|svg)$/,
          /\.(graphql|gql)$/,
          /\.json$/,
          /\.txt$/,
          /\.md$/,
        ],
        loader: 'file-loader',
        options: {
          name: staticAssetName,
        },
      },

      // Exclude dev modules from production build
      ...(isDebug ? [] : [
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

  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = {
  ...config,

  name: 'client',
  target: 'web',

  entry: {
    client: ['babel-polyfill', './src/loader.client.ts'],
  },

  plugins: [
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
      processOutput: (x) => `module.exports = ${JSON.stringify(x, null, 2)};`,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),

    ...(isDebug ? [] : [
      // Decrease script evaluation time
      // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
      new webpack.optimize.ModuleConcatenationPlugin(),

      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new (webpack.optimize as any).UglifyJsPlugin({
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
    ]),

    // Webpack Bundle Analyzer
    // https://github.com/th0r/webpack-bundle-analyzer
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    net: 'empty',
    fs: 'empty',
    tls: 'empty',
  },
};

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = {
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

  // Webpack mutates resolve object, so clone it to avoid issues
  // https://github.com/webpack/webpack/issues/4817
  resolve: {
    ...config.resolve,
  },

  module: {
    ...config.module,

    rules: overrideRules(config.module.rules, (rule) => {
      // Override babel-preset-env configuration for Node.js
      if (rule.loader === 'awesome-typescript-loader') {
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
                            node: pkg.engines.node.match(/(\d+\.?)+/)[0],
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
      if (
        rule.loader === 'file-loader' ||
        rule.loader === 'url-loader' ||
        rule.loader === 'svg-url-loader'
      ) {
        return {
          ...rule,
          options: {
            ...rule.options,
            name: `public/assets/${rule.options.name}`,
            publicPath: (url) => url.replace(/^public/, ''),
          },
        };
      }

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
    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      '__DEV__': isDebug,
    }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.js.org/plugins/banner-plugin/
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],

  // Do not replace node globals with polyfills
  // https://webpack.js.org/configuration/node/
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
