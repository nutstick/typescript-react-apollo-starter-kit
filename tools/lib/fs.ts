/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as fs from 'fs';
import * as globPkg from 'glob';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as rimraf from 'rimraf';

export const readFile = (file) => new Promise<string>((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, data) => (err ? reject(err) : resolve(data)));
});

export const writeFile = (file, contents) => new Promise<string>((resolve, reject) => {
  fs.writeFile(file, contents, { encoding: 'utf8' }, (err) => (err ? reject(err) : resolve()));
});

export const copyFile = (source, target) => new Promise<string>((resolve, reject) => {
  let cbCalled = false;
  function done(err) {
    if (!cbCalled) {
      cbCalled = true;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  }

  const rd = fs.createReadStream(source);
  rd.on('error', (err) => done(err));
  const wr = fs.createWriteStream(target);
  wr.on('error', (err) => done(err));
  wr.on('close', (err) => done(err));
  rd.pipe(wr);
});

export const readDir = (pattern, options) => new Promise<string[]>((resolve, reject) =>
  globPkg(pattern, options, (err, result) => (err ? reject(err) : resolve(result))),
);

export const makeDir = (name) => new Promise<void>((resolve, reject) => {
  mkdirp(name, (err) => (err ? reject(err) : resolve()));
});

export const glob = (pattern) => new Promise<string[]>((resolve, reject) => {
  globPkg(pattern, (err, val) => (err ? reject(err) : resolve(val)));
});

export const copyDir = async (source, target) => {
  const dirs = await readDir('**/*.*', {
    cwd: source,
    nosort: true,
    dot: true,
  });
  await Promise.all(dirs.map(async dir => {
    const from = path.resolve(source, dir);
    const to = path.resolve(target, dir);
    await makeDir(path.dirname(to));
    await copyFile(from, to);
  }));
};

export const cleanDir = (pattern, options) => new Promise<any>((resolve, reject) =>
  rimraf(pattern, { glob: options }, (err, result) => (err ? reject(err) : resolve(result))),
);
