import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';

interface INotificationDocument {
  _id?: string;
  body?: string;
  owner: string;
  createAt: Date;
  isRead: boolean;
}

@Index({
  createAt: -1,
})
@Collection('notification')
class Notification extends Instance<INotificationDocument, Notification> implements INotificationDocument {
  @ObjectID
  _id: string;
  @Property(String)
  body: string;
  @ObjectID
  owner: string;
  @Property(Date, true)
  createAt: Date;
  @Property(Boolean, true)
  isRead: boolean;
}

export { Notification, INotificationDocument };
