import { DocumentNode } from 'graphql';

declare const _: DocumentNode;
export = _;

namespace _ {
  interface IPageInfo {
    endCurosr?: string;
    hasNextPage?: boolean;
  }

  interface IEdge<T> {
    node: T;
    cursor: string;
  }

  export interface IPage<T> {
    totalCount?: number;
    edges: Array<IEdge<T>>;
    pageInfo: IPageInfo;
  }
}
