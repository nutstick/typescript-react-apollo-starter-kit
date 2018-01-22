import { Core, Model } from 'iridium';
import { mongodb } from '../../config';
import { IUserDocument, User } from './User';

class Database extends Core {
  User = new Model<IUserDocument, User>(this, User);
}

const database = new Database({ ...mongodb });

export { database, Database };
