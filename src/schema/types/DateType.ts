import { GraphQLScalarType } from 'graphql';

const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date type',
  serialize(value) {
    return value;
  },
});

export default DateType;