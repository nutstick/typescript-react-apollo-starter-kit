import AsyncComponents from '../../components/AsyncComponents';

export const Home = AsyncComponents(() => {
  return import('./Home');
});
