import { AsyncComponents } from '../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./NotFound').then((module) => module.NotFound));
