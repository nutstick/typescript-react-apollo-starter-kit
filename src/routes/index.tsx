import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HomePage } from './Home';
import { NotFoundPage } from './NotFound';

export const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err);
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (props) => (
  <Layout ketasda="asdad" test="1232">
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);
