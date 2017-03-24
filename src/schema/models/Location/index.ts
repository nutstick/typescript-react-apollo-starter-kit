import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';

interface ILocationDocument {
  _id?: string;
  location: string;
  latitude: number;
  longitude: number;
};

@Index({ location: 1 })
@Collection('location')
class Location extends Instance<ILocationDocument, Location> implements ILocationDocument {
  @ObjectID
  _id: string;
  @Property(/^.+$/, true)
  location: string;
  @Property(Number, true)
  latitude: number;
  @Property(Number, true)
  longitude: number;
}

export default Location;
