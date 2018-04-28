import { transform } from 'babel-core';
import * as BluebirdPromise from 'bluebird';
import * as path from 'path';
import * as ts from 'typescript';
import * as pkg from '../package.json';
import { locales } from '../src/config';
import { glob, readFile, writeFile } from './lib/fs';

import * as gaze from 'gaze';

const GLOB_PATTERN = 'src/**/*.{js,jsx,ts,tsx}';
const fileToMessages = {};
let messages = {};

const posixPath = (fileName) => fileName.replace(/\\/g, '/');

async function writeMessages(fileName, msgs) {
  await writeFile(fileName, `${JSON.stringify(msgs, null, 2)}\n`);
}

// merge messages to source files
async function mergeToFile(locale, toBuild) {
  const fileName = `src/messages/${locale}.json`;
  const originalMessages = {};
  try {
    const oldFile = await readFile(fileName);

    let oldJson;
    try {
      oldJson = JSON.parse(oldFile);
    } catch (err) {
      throw new Error(`Error parsing messages JSON in file ${fileName}`);
    }

    oldJson.forEach((message) => {
      originalMessages[message.id] = message;
      delete originalMessages[message.id].files;
    });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  Object.keys(messages).forEach((id) => {
    const newMsg = messages[id];
    originalMessages[id] = originalMessages[id] || { id };
    const msg = originalMessages[id];
    msg.description = newMsg.description || msg.description;
    msg.defaultMessage = newMsg.defaultMessage || msg.defaultMessage;
    msg.message = msg.message || '';
    msg.files = newMsg.files;
  });

  const result = Object.keys(originalMessages)
    .map((key) => originalMessages[key])
    .filter((msg) => msg.files || msg.message);

  await writeMessages(fileName, result);

  console.log(`Messages updated: ${fileName}`);

  if (toBuild && locale !== '_default') {
    const buildFileName = `dist/messages/${locale}.json`;
    try {
      await writeMessages(buildFileName, result);
      console.log(`Build messages updated: ${buildFileName}`);
    } catch (err) {
      console.error(`Failed to update ${buildFileName}`);
    }
  }
}

// call everytime before updating file!
function mergeMessages() {
  messages = {};
  Object.keys(fileToMessages).forEach((fileName) => {
    fileToMessages[fileName].forEach((newMsg) => {
      const message = messages[newMsg.id] || {};
      messages[newMsg.id] = {
        description: newMsg.description || message.description,
        defaultMessage: newMsg.defaultMessage || message.defaultMessage,
        message: newMsg.message || message.message || '',
        files: message.files ? [...message.files, fileName].sort() : [fileName],
      };
    });
  });
}

async function updateMessages(toBuild) {
  mergeMessages();
  await BluebirdPromise.all(
    ['_default', ...locales].map((locale) => mergeToFile(locale, toBuild)),
  );
}

/**
 * Extract react-intl messages and write it to src/messages/_default.json
 * Also extends known localizations
 */
async function extractMessages() {
  const compare = (a, b) => {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  };

  const compareMessages = (a, b) => compare(a.id, b.id);

  const processFile = async (fileName) => {
    try {
      const code = await readFile(fileName);
      const posixName = posixPath(fileName);

      const typescriptCode = ts.transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.ES2015,
          target: ts.ScriptTarget.ES2015,
          jsx: ts.JsxEmit.Preserve,
        },
      });

      const result = (transform(typescriptCode.outputText, {
        presets: [
          [ 'env', { targets: { node: 'current' } } ],
          'stage-2',
          'react',
        ],
        plugins: ['react-intl'],
      }) as any).metadata['react-intl'];
      if (result.messages && result.messages.length) {
        fileToMessages[posixName] = result.messages.sort(compareMessages);
      } else {
        delete fileToMessages[posixName];
      }
    } catch (err) {
      console.error(`ERROR: extractMessages In ${fileName}:\n`, err.codeFrame || err);
    }
  };

  const files = await glob(GLOB_PATTERN);

  await BluebirdPromise.all(files.map(processFile));
  await updateMessages(false);

  if (process.argv.includes('--watch')) {
    const watcher = await new BluebirdPromise<{ on: any }>((resolve, reject) => {
      gaze(GLOB_PATTERN, (err, val) => (err ? reject(err) : resolve(val)));
    });
    watcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../').length);
      await processFile(relPath);
      await updateMessages(true);
    });
  }
}

export default extractMessages;
