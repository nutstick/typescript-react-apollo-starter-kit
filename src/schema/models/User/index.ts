import * as Iridium from 'iridium';
import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';
import { Account, IAccountDocument } from './account';
import { GuideDetail, IGuideDetailDocument } from './guide';
import { IPermissionTypeDocument, PermissionType } from './permissionType';

interface IUserDocument {
  _id?: string;
  name: string;
  account: IAccountDocument;
  avatar: string;
  gender?: string;
  locale?: string;
  timezone?: number;
  createAt?: Date;
  updateAt?: Date;
  type?: IPermissionTypeDocument;
  guide?: IGuideDetailDocument;
}

@Index({
  'account.email': 1,
  'account.facebookAccessCode': 1,
  'account.googleAccessCode': 1,
}, { unique: true })
@Collection('users')
class User extends Instance<IUserDocument, User> implements IUserDocument {
  @ObjectID
  _id: string;
  @Property(/^.+$/, true)
  name: string;

  @Property(Account, true)
  account: IAccountDocument;

  @Property(String, true)
  avatar: string;
  @Property(/^(Male|Female|Other)$/, false)
  gender: string;
  @Property(/^.+$/, false)
  locale: string;
  @Property(Number, false)
  timezone: number;
  @Property(Date, false)
  createAt: Date;
  @Property(Date, false)
  updateAt: Date;

  @Property(PermissionType, false)
  type: IPermissionTypeDocument;
  @Property(GuideDetail, false)
  guide: IGuideDetailDocument;

  static onCreating(user: IUserDocument) {
    user.createAt = new Date();
    user.updateAt = new Date();
  }

  static onSaving(user: User, changes: Iridium.Changes) {
    user.updateAt = new Date();
  }
}

export { IUserDocument, User };
