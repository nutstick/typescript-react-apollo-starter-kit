import generate from 'babel-generator';
import { ObjectID as id } from 'mongodb';
import { Database } from '../src/schema';
// tslint:disable-next-line:no-var-requires
const m = require('casual');

// Pass generator as callback
const array_of = (times, generator) => {
  return Array.apply(null, Array(times)).map(() => generator());
};
export async function seed(database: Database) {
  // Clear database
  await database.connection.dropDatabase();
}
