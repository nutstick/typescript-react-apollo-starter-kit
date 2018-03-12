import { AsyncComponents } from '../../components/AsyncComponents';

export const Home = AsyncComponents(() => import('./TodoPage').then((module) => module.TodoPage));
