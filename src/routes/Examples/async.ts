import { AsyncComponents } from '../../components/AsyncComponents';

export const Home = AsyncComponents(() => import('./Examples').then((module) => module.Examples));
