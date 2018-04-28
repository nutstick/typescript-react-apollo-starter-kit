import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Examples } from '../routes/Examples';
import { Home } from '../routes/Home';
import { NotFound } from '../routes/NotFound';
import { TodoPage as Todo } from '../routes/Todo';

export default (props) => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/examples" component={Examples} />
      <Route exact path="/examples/todo" component={Todo} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
);
