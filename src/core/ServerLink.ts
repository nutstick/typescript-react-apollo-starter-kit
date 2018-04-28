import { ApolloLink, Observable } from 'apollo-link';
import {
  execute,
  GraphQLSchema,
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
      let canceled = false;
      execute(
        this.schema,
        operation.query,
        this.optionsData.rootValue,
        this.optionsData.context,
        operation.variables,
        operation.operationName,
      )
        .then((data) => {
          if (canceled) {
            return;
          }
          // we have data and can send it to back up the link chain
          observer.next(data);
          observer.complete();
          return data;
        })
        .catch((err) => {
          if (canceled) {
            return;
          }

          observer.error(err);
        });

      return () => {
          canceled = true;
        };
    });
  }
}
