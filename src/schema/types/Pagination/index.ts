import resolver from './resolver';
import * as type from './typeDef.gql';

interface IPageInfo {
  endCurosr?: string;
  hasNextPage?: boolean;
}

interface IEdge<T> {
  node: T;
  cursor: string;
}

interface IPage<T> {
  totalCount?: number;
  edges: Array<IEdge<T>>;
  pageInfo: IPageInfo;
}

export {
  resolver,
  type,
  IEdge,
  IPage,
};
