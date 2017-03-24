import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';

interface ITestDocument {
  _id?: string;
  body?: string;
};

@Collection('test')
class Test extends Instance<ITestDocument, Test> implements ITestDocument {
  @ObjectID
  _id: string;
  @Property(String, false)
  body: string;
}

export { ITestDocument, Test };
