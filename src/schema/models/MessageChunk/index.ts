import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';
import { Thread } from '../Thread';
import { IMessageDocument, Message } from './message';

interface IMessageChunkDocument {
  _id?: string;
  thread: string;
  start: Date;
  end: Date;
  nextChunk?: string;
  prevChunk?: string;

  messages: IMessageDocument[];
}

@Index({
  'start': 1,
  'end': -1,
  'messages.createAt': -1,
  'thread': 1,
})
@Collection('messageChunk')
class MessageChunk extends Instance<IMessageChunkDocument, MessageChunk> implements  IMessageChunkDocument{
  @ObjectID
  _id: string;
  @ObjectID
  thread: string;
  @Property(Date, true)
  start: Date;
  @Property(Date, true)
  end: Date;
  @ObjectID
  nextChunk: string;
  @ObjectID
  prevChunk: string;

  @Property([Message], true)
  messages: IMessageDocument[];
}

export default MessageChunk;
