import * as path from 'path';
import * as readline from 'readline';
import { copyFileAndReplace, makeDir, readDir } from './lib/fs';
import { format } from './run';

function create() {
  const command = process.argv[3];

  if (command.toLowerCase() === 'page') {
    // TODO: Fix wording
    return new Promise<any>((resolve, reject) => {
      const prompts = readline.createInterface(process.stdin, process.stdout);

      prompts.question('Name of page, you want to create? ', async (word) => {
        const page = word[0].toUpperCase() + word.substr(1);

        const existPage = await readDir('*/', {
          cwd: 'src/routes',
          nosort: true,
          dot: false,
        });
        if (existPage.includes(page + '/')) {
          return reject(new Error(`Page '${page}' already exists.`));
        }

        const source = 'tools/template/Page';
        const target = `src/routes/${page}`;
        const dirs = await readDir('**/*.*', {
          cwd: source,
          nosort: true,
          dot: true,
        });
        const start = new Date();
        console.log(`[${format(start)}] Create page '${page}'`);
        // Copy and replace search string in each file
        await Promise.all(dirs.map(async (dir) => {
          const from = path.resolve(source, dir);
          const to = path.resolve(target, dir).replace('_____', page);
          await makeDir(path.dirname(to));
          await copyFileAndReplace(from, to, '_____', page);
        }));

        const end = new Date();
        const time = end.getTime() - start.getTime();
        console.log(`[${format(end)}] Finished create page '${page}' after ${time} ms`);

        prompts.close();
        return resolve();
      });
    });
  }
}

export default create;
