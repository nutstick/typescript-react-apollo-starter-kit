import { Database } from '../models';

export interface IContext {
  database: Database;
  req: Express.Request;
  res?: Express.Response;
  user?: {
    _id?: string,
  };
}

export type ResolverFn<R, A> = (root?: R, args?: A, context?: IContext) => any | Promise<any>;

export interface TypeResolver<R> {
  [key: string]: ResolverFn<R, any>;
  __resolveType?: (root?, context?, info?) => any;
}

export interface IResolver<R, A> {
  [key: string]: {
    [key: string]: ResolverFn<R, A>,
    __resolveType?: (root?, context?, info?) => string,
  };
}

export interface ISubsciption {
  [key: string]: {
    [key: string]: any;
  };
}
