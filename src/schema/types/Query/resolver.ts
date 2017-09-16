import * as BluebirdPromise from 'bluebird';
import * as fs from 'fs';
import { join } from 'path';
import { locales } from '../../../config';
import { IResolver } from '../index';

// A folder with messages
// In development, source dir will be used
const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './messages');

const readFile = BluebirdPromise.promisify(fs.readFile);

const resolver: IResolver<any, any> = {
  Query: {
    helloworld() {
      return 'Hello Word';
    },
    async me(_, __, { database, user }) {
      if (user && user._id) {
        return await database.User.findOne({ _id: user._id });
      }
      return null;
    },
    async intl(_, { locale }) {
      if (!locales.includes(locale)) {
        throw new Error(`Locale '${locale}' not supported`);
      }

      let localeData;
      try {
        localeData = await readFile(join(MESSAGES_DIR, `${locale}.json`));
      } catch (err) {
        if (err.code === 'ENOENT') {
          throw new Error(`Locale '${locale}' not found`);
        }
      }

      return JSON.parse(localeData);
    },
  },
};

export default resolver;
