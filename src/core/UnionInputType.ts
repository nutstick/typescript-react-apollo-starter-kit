import {
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLScalarType,
  GraphQLString,
  isValidJSValue,
  isValidLiteralValue,
  ObjectValueNode,
  valueFromAST,
  ValueNode,
} from 'graphql';

type InputType = GraphQLInputObjectType | GraphQLScalarType;

interface ObjectInputTypes {
  [key: string]: InputType;
}

type InputTypes = InputType[] | UnionInputType | ObjectInputTypes;

export interface UnionInputTypeOptions {
  /**
   * 	@param  {array} options.name
   *  Name for the union type. Must be unique in your schema. Has to be used in queries to nested unions.
   */
  name: string;

  description?: string;

  /**
   * 	@param  {array|object} options.inputTypes
   *  Optional. Either array of GraphQLInputObjectType objects or UnionInputTypes (which are Scalars really)
   *  or object with {name:GraphQLInputObjectType} pairs. Will be ignored if resolveType is provided.
   */
  inputTypes: InputTypes;

  /**
   * 	 @param  {string} options.typeKey
   *   Optional. If provided, is used as a key containing the type name. If not, the query argument must
   * 	 contain _type_ and _value_ parameteres in this particular order
   */
  typeKey?: string;

  /**
   * 	 @param  {function} options.resolveType
   *   Optional. If provided, is called with a key name and must return corresponding GraphQLInputObjectType or null
   */
  resolveType?: (name) => GraphQLInputObjectType | null;

  /**
   * 	 @param  {function} options.resolveTypeFromAst
   *   Optional. If provided, is called with full AST for the input argument and must return
   * 	 corresponding GraphQLInputObjectType or null
   */
  resolveTypeFromAst?: (ast: ValueNode) => GraphQLInputObjectType | null;

  /**
   * 	 @param  {function} options.resolveTypeFromValue
   *   Optional. If provided, is called with a variable value and must return
   * 	 corresponding GraphQLInputObjectType or null
   */
  resolveTypeFromValue?: (value) => GraphQLInputObjectType | null;
}

function helper(name, type) {
  return new GraphQLInputObjectType({
    name,
    fields: () => {
      return {
        _type_: {
          type: GraphQLString,
        },
        _value_: {
          type,
        },
      };
    },
  });
}

export class UnionInputType extends GraphQLScalarType {
  constructor(options: UnionInputTypeOptions) {
    const { name, description } = options;
    const { resolveType, resolveTypeFromAst, typeKey, resolveTypeFromValue } = options;
    let referenceTypes = options.inputTypes;

    if (!resolveType && !resolveTypeFromAst) {
      if (Array.isArray(referenceTypes)) {
        referenceTypes = referenceTypes.reduce((acc, refType) => {
          if (!(refType instanceof GraphQLInputObjectType || refType instanceof GraphQLScalarType)) {
            throw new GraphQLError(`${name} (UnionInputType): all inputTypes must be of ` +
              `GraphQLInputObjectType or GraphQLScalarType(created by UnionInputType function)`);
          }
          acc[refType.name] = (typeKey ? refType : helper(refType.name, refType));
          return acc;
        }, {});
      } else if (referenceTypes !== null && typeof referenceTypes === 'object') {
        Object.keys(referenceTypes).forEach((key) => {
          if (!(referenceTypes[key] instanceof GraphQLInputObjectType ||
            referenceTypes[key] instanceof GraphQLScalarType)) {
            throw new GraphQLError(`${name} (UnionInputType): all inputTypes must be of ` +
              `GraphQLInputObjectType or GraphQLScalarType(created by UnionInputType function`);
          }
          referenceTypes[key] = typeKey ? referenceTypes[key] : helper(key, referenceTypes[key]);
        });
      }
    }

    super({
      name,
      description,
      serialize(value) {
        return value;
      },
      parseValue(value) {
        let type;
        let inputType;

        if (typeof resolveTypeFromValue === 'function') {
          inputType = resolveTypeFromValue(value);
        } else {
          if (typeKey) {
            if (value[typeKey]) {
              type = value[typeKey];
            } else {
              throw new GraphQLError(`${name} (UnionInputType): Expected an object with "${typeKey}" property`);
            }
          } else if (value._type_ && value._value_) {
            type = value._type_;
          } else {
            throw new GraphQLError(`${name} (UnionInputType): Expected an object with _type_ and ` +
              `_value_ properties in this order`);
          }

          if (typeof resolveType === 'function') {
            inputType = resolveType(type);
            if (!typeKey) {
              inputType = helper(type, inputType);
            }
          } else {
            inputType = referenceTypes[type];
          }
        }
        if (isValidJSValue(value, inputType).length === 0) {
          return value;
        } else {
          throw new GraphQLError('');
        }
      },
      parseLiteral(ast: ObjectValueNode) {
        let type;
        let inputType;

        if (typeof resolveTypeFromAst === 'function') {
          inputType = resolveTypeFromAst(ast);
        } else {
          if (typeKey) {
            try {
              for (const field of ast.fields) {
                if (field.name.value === typeKey) {
                  type = (field.value as any).value;
                  break;
                }
              }
              if (!type) {
                throw new Error();
              }
            } catch (err) {
              throw new GraphQLError(`${name} (UnionInputType): Expected an object with "${typeKey}" property`);
            }
          } else {
            try {
              if (ast.fields[0].name.value === '_type_' && ast.fields[1].name.value === '_value_') {
                type = (ast.fields[0].value as any).value;
              } else {
                throw new Error();
              }
            } catch (err) {
              throw new GraphQLError(`${name} (UnionInputType): Expected an object with _type_ and _value_ ` +
                `properties in this order`);
            }
          }
          if (typeof resolveType === 'function') {
            inputType = resolveType(type);
            if (!typeKey) {
              inputType = helper(type, inputType);
            }
          } else {
            inputType = referenceTypes[type];
          }
        }
        if (isValidLiteralValue(inputType, ast).length === 0) {
          return valueFromAST(ast, inputType);
        } else {
          throw new GraphQLError(`expected type ${type},` +
            `found ${ast.loc.source.body.substring(ast.loc.start, ast.loc.end)}`);
        }
      },
    });
  }
}
