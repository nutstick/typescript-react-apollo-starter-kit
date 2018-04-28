import { seed } from '../seeds/mongo-seed';
import { database } from '../src/schema';

/**
 * Seeds database.
 */
async function seeds() {
  await database.connect();
  await seed(database);
  await database.close();
}

export default seeds;
