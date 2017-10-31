import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../routes/Home';
import { NotFound } from '../routes/NotFound';

export const errorLoading = (err) => {
  // tslint:disable-next-line:no-console
  console.error('Dynamic page loading failed', err);
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (props) => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
);
