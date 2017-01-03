/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as path from 'path';
import { cleanDir, copyDir, copyFile, makeDir, writeFile } from './lib/fs';

const gaze = require('gaze');
const pkg = require('../package.json');

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
    copyDir('src/content', 'dist/content'),
    copyDir('src/public', 'dist/public'),
    copyDir('src/messages', 'dist/messages'),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = await new Promise<any>((resolve, reject) => {
      gaze([
        'src/content/**/*',
        'src/messages/**/*',
        'src/public/**/*',
      ], (err, val) => (err ? reject(err) : resolve(val)));
    });

    watcher.on('all', async (event, filePath) => {
      const dist = path.join('dist/', path.relative('src', filePath));
      switch (event) {
        case 'added':
        case 'renamed':
        case 'changed':
          if (filePath.endsWith('/')) {
            return;
          }
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'deleted':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      console.log(`[file ${event}] ${dist}`);
    });
  }
}

export default copy;
