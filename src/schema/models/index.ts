import { Core, Model } from 'iridium';
import { mongodb } from '../../config';
import { IReviewDocument, Review } from './Review';
import { ITestDocument, Test } from './test';
import { IThreadDocument, Thread } from './Thread';
import { IUserDocument, User } from './User';

class Database extends Core {
  Test = new Model<ITestDocument, Test>(this, Test);

  User = new Model<IUserDocument, User>(this, User);
  Thread = new Model<IThreadDocument, Thread>(this, Thread);
  Review = new Model<IReviewDocument, Review>(this, Review);
}

const database = new Database({ database: mongodb });

export { database, Database };
