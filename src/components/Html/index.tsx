import * as React from 'react';
import * as Helmet from 'react-helmet';
import { analytics } from '../../config';

export interface IHtmlProps extends React.Props<any> {
  title: string;
  description: string;
  styles: Array<{
    id: string,
    cssText: string,
  }>;
  children?: string;
  state?: any;
}

const Html: React.StatelessComponent<IHtmlProps> = ({ title, description, styles, children, state }) => {
  const head = Helmet.rewind();
  return (<html className="no-js">
    <head>
      {head.base.toComponent()}
      {head.title.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
      {head.script.toComponent()}

      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" href="apple-touch-icon.png" />
      {styles.map((style) =>
        <style
          key={style.id}
          id={style.id}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: style.cssText }}
        />,
      )}
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
      {state && (
        <script
          dangerouslySetInnerHTML={{ __html:
          `window.__INITIAL_STATE__=${JSON.stringify(state)}` }}
        />
      )}
      <script defer src="/assets/vendor.js"></script>
      <script defer src="/assets/client.js"></script>
      {analytics.google.trackingId && (
        <script
          dangerouslySetInnerHTML={{ __html:
          'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
          `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
        />
      )}
      {analytics.google.trackingId && (
        <script src="https://www.google-analytics.com/analytics.js" async defer />
      )}
    </body>
  </html>);
};

export default Html;
