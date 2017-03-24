import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';
import { IParticicantDocument, Participant } from './participant';

interface IThreadDocument {
  _id?: string;
  name?: string;
  avatar: string;
  startDate?: Date;
  endDate?: Date;
  places?: string[];
  price?: number;

  participants: IParticicantDocument[];

  createAt: Date;
  updateAt: Date;

  lastestMessageChunk?: string;
};

@Index({
  'name': 1,
  'participant.participant': 1,
  'participant.createAt': 1,
  'updateAt': -1,
})
@Collection('threads')
class Thread extends Instance<IThreadDocument, Thread> implements IThreadDocument {
  @ObjectID
  _id: string;
  @Property(/^.+$/)
  name: string;
  @Property(String)
  avatar: string;
  @Property(Date)
  startDate: Date;
  @Property(Date)
  endDate: Date;
  @Property([String])
  places: string[];

  @Property([Participant])
  participants: IParticicantDocument[];

  @Property(Date, true)
  createAt: Date;
  @Property(Date, true)
  updateAt: Date;

  @ObjectID
  lastestMessageChunk: string;
}

export { IThreadDocument, Thread };
