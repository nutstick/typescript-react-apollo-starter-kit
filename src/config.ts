/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.ts` from inside the client-side code.',
  );
}

export const locales = [
  /* @intl-code-template '${lang}-${COUNTRY}', */
  'en-US',
  'cs-CZ',
  'th-TH',
  /* @intl-code-template-end */
];

export const port = process.env.PORT || 3000;

export const wsport = process.env.WSPORT || 3001;

export const mongodb = {
  host: process.env.MONGO_HOST || `localhost`,
  port: parseInt(process.env.MONGO_PORT, 10) || 27017,
  database: process.env.MONGO_DB || 'ts-reactql-starter-kit',
};

export const redis = {
  host: process.env.REDIS_HOST || `localhost`,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
};

export const api = {
  // API URL to be used in the client-side code
  clientUrl: process.env.API_CLIENT_URL || '',
  // API URL to be used in the server-side code
  serverUrl:
    process.env.API_SERVER_URL ||
    `http://localhost:${port}/graphql`,
  // WS URL
  wsUrl:
    process.env.WS_URL || `ws://localhost:${wsport}/subscriptions`,
};

export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

// Web analytics
export const analytics = {
  // https://analytics.google.com/
  googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
};

// Authentication
export const auth = {
  jwt: { secret: process.env.JWT_SECRET || 'Typescript React Starter Kit' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '186244551745631',
    secret:
      process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
  },

  // https://cloud.google.com/console/project
  google: {
    id:
      process.env.GOOGLE_CLIENT_ID ||
      '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret:
      process.env.TWITTER_CONSUMER_SECRET ||
      'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },
};

export const uploadDir = './public/images';
