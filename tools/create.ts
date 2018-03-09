import * as path from 'path';
import * as readline from 'readline';
import { copyFileAndReplace, makeDir, readDir } from './lib/fs';
import { format } from './run';

const paths = {
  Page: 'src/routes/',
  Component: 'src/components/',
  Type: 'src/schema/types/',
};

function create() {
  let command = process.argv[3];
  command = command[0].toUpperCase() + command.substr(1);

  if (command === 'Page' || command === 'Component' || command === 'Type') {
    return new Promise<any>((resolve, reject) => {
      const prompts = readline.createInterface(process.stdin, process.stdout);

      // TODO: Fix wording
      prompts.question(`Name of ${command.toLowerCase()}, you want to create? `, async (word) => {
        const name = word[0].toUpperCase() + word.substr(1);

        const exist = await readDir('*/', {
          cwd: 'src/routes',
          nosort: true,
          dot: false,
        });
        if (exist.includes(name + '/')) {
          return reject(new Error(`${command} '${name}' already exists.`));
        }

        const source = `tools/template/${command}`;
        const target = `${paths[command]}${name}`;
        const dirs = await readDir('**/*.*', {
          cwd: source,
          nosort: true,
          dot: true,
        });
        const start = new Date();
        console.log(`[${format(start)}] Create ${command.toLowerCase()} '${name}'`);
        // Copy and replace search string in each file
        await Promise.all(dirs.map(async (dir) => {
          const from = path.resolve(source, dir);
          const to = path.resolve(target, dir).replace('_____', name);
          await makeDir(path.dirname(to));
          await copyFileAndReplace(from, to, '_____', name);
        }));

        const end = new Date();
        const time = end.getTime() - start.getTime();
        console.log(`[${format(end)}] Finished create ${command.toLowerCase()} '${name}' after ${time} ms`);

        prompts.close();
        return resolve();
      });
    });
  }
}

export default create;
