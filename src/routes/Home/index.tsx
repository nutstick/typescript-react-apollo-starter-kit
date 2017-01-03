import * as React from 'react';
import Home from './Home';

export default {
  getComponent (nextState, cb) {
    cb(null, Home);
  },
};

