import * as webpack from 'webpack';
import config from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  return new Promise((resolve, reject) => {
    webpack(config as any).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString(config[0].stats));
      return resolve();
    });
  });
}

export default bundle;
