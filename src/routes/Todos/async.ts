import { AsyncComponents } from '../../components/AsyncComponents';

export const Home = AsyncComponents(() => import('./Todos').then((module) => module.Todos));
