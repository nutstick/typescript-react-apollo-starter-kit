import { ApolloLink, Observable, RequestHandler } from 'apollo-link';
import {
  execute,
  GraphQLSchema,
  specifiedRules,
  validate,
} from 'graphql';

interface FetchOptions {
  schema: GraphQLSchema;
  rootValue?: any;
  context?: any;
  validationRules?: any;
}

export class ServerLink extends ApolloLink {
  public schema: GraphQLSchema;
  public optionsData: {
    rootValue?: any,
    context?: any,
    validationRules?: any,
  };

  constructor(opts: FetchOptions) {
    super();

    const { schema, ...options } = opts;
    this.schema = schema;
    this.optionsData = options;
  }

  public request(operation) {
    return new Observable((observer) => {
      let validationRules = specifiedRules;
      const customValidationRules = this.optionsData.validationRules;
      if (customValidationRules) {
        validationRules = validationRules.concat(customValidationRules);
      }

      const validationErrors = validate(this.schema, operation.query, validationRules);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      execute(
        this.schema,
        operation.query,
        this.optionsData.rootValue,
        this.optionsData.context,
        operation.variables,
        operation.operationName,
      )
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  }
}
