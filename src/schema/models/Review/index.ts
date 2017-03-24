import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';

interface IReviewDocument {
  _id?: string;
  targetUser: string;
  owner: string;
  createAt: Date;
  updateAt: Date;

  title: string;
  body?: string;
  score: number;
};

@Index({
  updateAt: -1,
  score: 1,
  targetUser: 1,
  owner: 1,
})
@Collection('review')
class Review extends Instance<IReviewDocument, Review> implements IReviewDocument {
  @ObjectID
  _id: string;
  @ObjectID
  targetUser: string;
  @ObjectID
  owner: string;

  @Property(Date, true)
  createAt: Date;
  @Property(Date, true)
  updateAt: Date;

  @Property(String, true)
  title: string;
  @Property(String, false)
  body: string;
  @Property(Number, true)
  score: number;
}

export { IReviewDocument, Review };
