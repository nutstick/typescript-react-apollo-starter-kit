import * as fetch from 'isomorphic-fetch';
import * as React from 'react';
import Layout from '../../components/Layout';
import Home from './Home';

export default {
  getComponent (nextState, cb) {
    cb(null, Home);
  },
  async action() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{news{title,link,pubDate,content}}',
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.news) {
      throw new Error('Failed to load the news feed.');
    }

    return {
      title: 'React Starter Kit',
      component: <Layout><Home news={data.news} /></Layout>,
    };
  },
};
