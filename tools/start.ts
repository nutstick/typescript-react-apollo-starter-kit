import * as browserSync from 'browser-sync';
import * as cp from 'child_process';
import * as express from 'express';
import * as path from 'path';
import * as createLaunchEditorMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import clean from './clean';
import copy from './copy';
import run, { format } from './run';
import webpackConfig from './webpack.config';

const isDebug = !process.argv.includes('--release');
process.argv.push('--watch');

const [clientConfig, serverConfig] = webpackConfig;

const watchOptions = {
  // Watching may not work with NFS and machines in VirtualBox
  // Uncomment next line if it is your case (use true or interval in milliseconds)
  // poll: true,
  // Decrease CPU or memory usage in some file systems
  ignored: /node_modules/,
};

function createCompilationPromise(name, compiler, config) {
  return new Promise((resolve, reject) => {
    let timeStart = new Date();
    compiler.plugin('compile', () => {
      timeStart = new Date();
      console.info(`[${format(timeStart)}] Compiling '${name}'...`);
    });
    compiler.plugin('done', (stats) => {
      console.info(stats.toString(config.stats));
      const timeEnd = new Date();
      const time = timeEnd.getTime() - timeStart.getTime();
      if (stats.hasErrors()) {
        console.info(
          `[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`,
        );
        reject(new Error('Compilation failed!'));
      } else {
        console.info(
          `[${format(
            timeEnd,
          )}] Finished '${name}' compilation after ${time} ms`,
        );
        resolve(stats);
      }
    });
  });
}

let server;

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  if (server) {
    return server;
  }

  server = express();
  server.use(createLaunchEditorMiddleware());
  server.use(express.static(path.resolve(__dirname, '../public')));

  // Configure client-side hot module replacement
  (clientConfig.entry as webpack.Entry).client = [
    'react-error-overlay',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true',
  ]
    .concat((clientConfig.entry as webpack.Entry).client)
    .sort((a, b) => (b.includes('polyfill') as any) - (a.includes('polyfill') as any));
  clientConfig.output.filename = clientConfig.output.filename.replace('chunkhash', 'hash');
  clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace('chunkhash', 'hash');
  const loader = (clientConfig.module as webpack.NewModule).rules
  .find((x) => (x as any).loader === 'awesome-typescript-loader') as any;
  loader.options.babelOptions.plugins = (loader.options.babelOptions.plugins || [])
    .concat(['react-hot-loader/babel']);
  loader.loaders = ['react-hot-loader/webpack', `${loader.loader}?${JSON.stringify(loader.options)}`];
  delete loader.loader;
  delete loader.options;
  clientConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  );

  // Save the server-side bundle files to the file system after compilation
  // https://github.com/webpack/webpack-dev-server/issues/62
  serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  serverConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';
  serverConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  );

  // Configure compilation
  await run(clean);

  const multiCompiler = webpack(webpackConfig);
  const clientCompiler = (multiCompiler as any).compilers.find(
    (compiler) => compiler.name === 'client',
  );
  const serverCompiler = (multiCompiler as any).compilers.find(
    (compiler) => compiler.name === 'server',
  );
  const clientPromise = createCompilationPromise(
    'client',
    clientCompiler,
    clientConfig,
  );
  const serverPromise = createCompilationPromise(
    'server',
    serverCompiler,
    serverConfig,
  );

  // https://github.com/webpack/webpack-dev-middleware
  server.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      quiet: true,
      watchOptions,
      headers: { 'Access-Control-Allow-Origin': '*' },
      serverSideRender: true,
    }),
  );

  // https://github.com/glenjamin/webpack-hot-middleware
  server.use(webpackHotMiddleware(clientCompiler, { log: console.log }));

  let appPromise;
  let appPromiseResolve;
  let appPromiseIsResolved = true;
  serverCompiler.plugin('compile', () => {
    if (!appPromiseIsResolved) {
      return;
    }
    appPromiseIsResolved = false;
    appPromise = new Promise((resolve) => (appPromiseResolve = resolve));
  });

  let app;
  server.use((req, res) => {
    appPromise
      .then(() => app.handle(req, res))
      .catch((error) => console.error(error));
  });

  function checkForUpdate(fromUpdate?: boolean) {
    const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
    if (!app.hot) {
      throw new Error(`${hmrPrefix}Hot Module Replacement is disabled.`);
    }
    if (app.hot.status() !== 'idle') {
      return Promise.resolve();
    }
    return app.hot
      .check(true)
      .then((updatedModules) => {
        if (!updatedModules) {
          if (fromUpdate) {
            console.info(`${hmrPrefix}Update applied.`);
          }

          return;
        }
        if (updatedModules.length === 0) {
          console.info(`${hmrPrefix}Nothing hot updated.`);
        } else {
          console.info(`${hmrPrefix}Updated modules:`);
          updatedModules.forEach((moduleId) =>
            console.info(`${hmrPrefix} - ${moduleId}`),
          );
          checkForUpdate(true);
        }
      })
      .catch((error) => {
        if (['abort', 'fail'].includes(app.hot.status())) {
          console.warn(`${hmrPrefix}Cannot apply update.`);
          app.wsServer.close();
          delete require.cache[require.resolve('../dist/server')];
          app = require('../dist/server').default;
          console.warn(`${hmrPrefix}App has been reloaded.`);
        } else {
          console.warn(
            `${hmrPrefix}Update failed: ${error.stack || error.message}`,
          );
        }
      });
  }

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (app && !error && !stats.hasErrors()) {
      checkForUpdate().then(() => {
        appPromiseIsResolved = true;
        appPromiseResolve();
      });
    }
  });

  // Wait until both client-side and server-side bundles are ready
  await clientPromise;
  await serverPromise;

  process.env.MESSAGES_DIR = path.join(__dirname, '../src/messages/');

  const timeStart = new Date();
  console.info(`[${format(timeStart)}] Launching server...`);

  // Load compiled src/server.js as a middleware
  app = require('../dist/server').default;
  appPromiseIsResolved = true;
  appPromiseResolve();

  // Launch the development server with Browsersync and HMR
  await new Promise((resolve, reject) =>
    browserSync.create().init({
      // https://www.browsersync.io/docs/options
      // server: 'src/main.server.tsx',
      server: {
        baseDir: 'src/main.server.tsx',
        middleware: [server],
      },
      open: !process.argv.includes('--silent'),
      // ...(isDebug ? {
      //   online: !!process.env.ONLINE || false,
      //   ghostmode: !!process.env.GHOSTMODE || false,
      //   notify: false,
      //   scrollProportionally: false,
      //   logFileChanges: false,
      //   logSnippet: false,
      //   minify: false,
      //   timestamps: false,
      // } : { notify: false, ui: false }),
        ...(isDebug ? {} : { notify: false, ui: false }),
    }, (error, bs) => (error ? reject(error) : resolve(bs))),
  );

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  console.info(`[${format(timeEnd)}] Server launched after ${time} ms`);
  return server;
}

export default start;
