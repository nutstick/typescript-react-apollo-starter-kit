import { AsyncComponents } from '../../components/AsyncComponents';

export const Home = AsyncComponents(() => import('./Home').then((module) => module.Home));
