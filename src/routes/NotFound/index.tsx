import * as React from 'react';
import NotFound from './NotFound';

const title = 'Page not found';

export default {
  path: '*',
  action() {
    return {
      title,
      components: (<NotFound title={title} />),
      status: 404,
    };
  },
};
