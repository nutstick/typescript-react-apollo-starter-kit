/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as webpack from 'webpack';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackMiddleware from 'webpack-middleware';
import clean from './clean';
import copy from './copy';
import extractMessages from './extractMessages';
import run from './run';
import runServer from './runServer';
import webpackConfig, { isDebug } from './webpack.config';

const browserSync = require('browser-sync');

process.argv.push('--watch');
const [config] = webpackConfig;

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(clean);
  await run(extractMessages);
  await run(copy);
  await new Promise((resolve) => {
    // Hot Module Replacement (HMR) + React Hot Reload
    if (isDebug) {
      // tslint:disable-next-line:no-string-literal
      (config.entry as webpack.Entry)['client'] = [
        'webpack/hot/only-dev-server',
        'webpack-hot-middleware/client',
        'react-hot-loader/patch',
      ]
        // tslint:disable-next-line:no-string-literal
        .concat(config.entry['client']);
      config.output.filename = config.output.filename.replace('[chunkhash', '[hash');
      config.output.chunkFilename = config.output.chunkFilename.replace('[chunkhash', '[hash');
      (
        (config.module as webpack.OldModule)
        .loaders.find((x: webpack.OldUseRule) => x.loaders.includes('ts-loader')) as webpack.OldUseRule
      )
        .loaders.unshift('react-hot-loader/webpack');
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NoErrorsPlugin());
    }

    const bundler = webpack(webpackConfig);
    const wpMiddleware = webpackMiddleware(bundler, {
      // IMPORTANT: webpack middleware can't access config,
      // so we should provide publicPath by ourselves
      publicPath: config.output.publicPath,

      // Pretty colored output
      stats: config.stats,
    });
    const hotMiddleware = webpackHotMiddleware((bundler as any).compilers[0]);

    let handleBundleComplete = async (stats?) => {
      // tslint:disable-next-line:no-shadowed-variable
      handleBundleComplete = (stats) => !stats.stats[1].compilation.errors.length && runServer();
      const server = await runServer();
      const bs = browserSync.create();

      bs.init({
        ...(config.debug ? {} : { notify: false, ui: false }),

        proxy: {
          target: server.host,
          middleware: [wpMiddleware, hotMiddleware],
          proxyOptions: {
            xfwd: true,
          },
        },
      }, resolve);
    };

    (bundler as any).plugin('done', (stats) => {
      handleBundleComplete(stats);
    });
  });
}

export default start;
