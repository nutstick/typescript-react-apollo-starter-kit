/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as chokidar from 'chokidar';
import * as path from 'path';
import * as pkg from '../package.json';
import { cleanDir, copyDir, copyFile, makeDir, writeFile } from './lib/fs';
import { format } from './run';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (dist) folder.
 */
async function copy() {
  await makeDir('dist');
  await Promise.all([
    writeFile('dist/package.json', JSON.stringify({
      private: true,
      engines: pkg.engines,
      dependencies: pkg.dependencies,
      scripts: {
        start: 'node src/main.server.js',
      },
    }, null, 2)),
    copyFile('LICENSE.txt', 'dist/LICENSE.txt'),
    copyFile('yarn.lock', 'dist/yarn.lock'),
    copyDir('public', 'dist/public'),
    copyDir('src/messages', 'dist/messages'),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch([
      'src/messages/**/*',
      'public/**/*',
    ], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const start = new Date();
      const src = path.relative('./', filePath);
      const dist = path.join('dist/', src.startsWith('src') ? path.relative('src', src) : src);
      switch (event) {
        case 'add':
        case 'change':
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      const end = new Date();
      const time = end.getTime() - start.getTime();
      console.log(`[${format(end)}] ${event} '${dist}' after ${time} ms`);
    });
  }
}

export default copy;
