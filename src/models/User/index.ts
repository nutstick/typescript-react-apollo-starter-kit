import * as mongoose from 'mongoose';
import { 
  GraphQLObjectType,
} from 'graphql';

type ObjectId = string;
enum Type {
  'Participant',
  'Guide',
}

interface IUser extends mongoose.Document {
  name: string;

  account: {
    id: string;
    email: string;
    password: string;
    facebook: string;
    google: string;
  },

  avatarUrl: string;
  createAt: Date;
  updateAt: Date;
  type: {
    guide: boolean;
    admin: boolean;
  };
  locations: [ObjectId];
  languages: [ObjectId];
  review: {
    score: number;
    count: number;
    reviews: [{
      score: number;
      body: string;
      owner: ObjectId,
      createAt: Date,
      updateAt: Date,
    }]
  };
  friend: {
    friends: [ObjectId],
    pendings: [{
      owner: ObjectId;
      createAt: Date;
    }]
  };
  thread: {
    pendings: [{
      owner: ObjectId;
      thread: ObjectId;
      createAt: Date;
      inviteAs: Type;
    }],
  };
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, required: true },

  account: {
    id: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    facebook: { type: String },
    google: { type: String },
  },

  avatarUrl: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  type: {
    guide: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  }],
  languages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
  }],
  review: {
    score: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    reviews: [{
      score: { type: Number, required: true },
      body: { type: String },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now },
    }],
  },
  friend: {
    friends: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pendings: [{
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createAt: { type: Date, default: Date.now },
    }],
  },
  thread: {
    pendings: [{
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
      },
      createAt: { type: Date, default: Date.now },
      inviteAs: { type: String, enum: ['Participant', 'Guide'] },
    }],
  },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;

