/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as browserSync from 'browser-sync';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as WriteFilePlugin from 'write-file-webpack-plugin';
import clean from './clean';
import copy from './copy';
import extractMessages from './extractMessages';
import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';

const isDebug = !process.argv.includes('--release');
process.argv.push('--watch');

const [clientConfig, serverConfig] = webpackConfig;

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(clean);
  await run(extractMessages);
  await run(copy);
  await new Promise((resolve) => {
    // Save the server-side bundle files to the file system after compilation
    // https://github.com/webpack/webpack-dev-server/issues/62
    serverConfig.plugins.push(new WriteFilePlugin({ log: false }));
    
    // Hot Module Replacement (HMR) + React Hot Reload
    if (isDebug) {
      // tslint:disable-next-line:no-string-literal
      clientConfig.entry['client'] = ['react-hot-loader/patch', 'webpack-hot-middleware/client?reload=true', clientConfig.entry['client']];
      clientConfig.output.filename = clientConfig.output.filename.replace('[chunkhash', '[hash');
      clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace('[chunkhash', '[hash');
      const loader = (<webpack.UseRule>
        (<webpack.NewModule> clientConfig.module).rules
          .find((x) => x.test === /\.ts(x?)$/)
      );
      clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
      clientConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    }

    const bundler = webpack(webpackConfig);
    const wpMiddleware = webpackDevMiddleware(<any> bundler, {
      // IMPORTANT: webpack middleware can't access config,
      // so we should provide publicPath by ourselves
      publicPath: clientConfig.output.publicPath,

      // Pretty colored output
      stats: clientConfig.stats,
    });
    const hotMiddleware = webpackHotMiddleware((<any> bundler).compilers[0]);

    let handleBundleComplete = async (stats?) => {
      handleBundleComplete = (_stats) => {
        return !_stats.stats[1].compilation.errors.length && runServer();
      }

      const server = await runServer();
      const bs = browserSync.create();

      (<any> bs).init({
        ...isDebug ? {} : { notify: false, ui: false },

        proxy: {
          target: server.host,
          middleware: [wpMiddleware, hotMiddleware],
          proxyOptions: {
            xfwd: true,
          },
        },
      }, resolve);
    };
    (bundler as any).plugin('done', (stats) => handleBundleComplete(stats));
  });
}

export default start;
