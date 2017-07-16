import { Database } from '../models';

export interface IContext {
  database: Database;
  user?: {
    _id?: string,
  };
}

export interface IResolver<R, A> {
  [key: string]: {
    [key: string]: (root?: R, args?: A, context?: IContext) => any,
    __resolveType?: (root?, context?, info?) => string,
  };
}
