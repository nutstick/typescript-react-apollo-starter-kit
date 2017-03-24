import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

const IntlMessageType = new ObjectType({
  name: 'IntlMessage',
  fields: {
    id: { type: new NonNull(StringType) },
    defaultMessage: { type: new NonNull(StringType) },
    message: { type: StringType },
    description: { type: StringType },
    files: { type: new List(StringType) },
  },
});

export default IntlMessageType;