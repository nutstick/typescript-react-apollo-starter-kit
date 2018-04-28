import { cleanDir } from './lib/fs';

/**
 * Cleans up the output (dist) directory.
 */
function clean() {
  return Promise.all([
    cleanDir('dist/*', {
      nosort: true,
      dot: true,
      ignore: ['dist/.git', 'dist/public'],
    }),

    cleanDir('dist/public/*', {
      nosort: true,
      dot: true,
      ignore: ['dist/public/.git'],
    }),
  ]);
}

export default clean;
