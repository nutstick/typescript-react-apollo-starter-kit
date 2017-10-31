import * as React from 'react';
import * as serialize from 'serialize-javascript';
import { analytics } from '../../config';

export namespace Html {
  export interface IProps extends React.Props<any> {
    title: string;
    description: string;
    styles: Array<{
      id: string,
      cssText: string,
    }>;
    scripts?: string[];
    app: {
      apiUrl?: string,
      // state?: any,
      lang: string,
    };
    children: string;
  }
  export type Props = IProps;
}

export class Html extends React.Component<Html.Props> {
  render() {
    const { title, description, styles, scripts, app, children } = this.props;
    return (
      <html className="no-js" lang={app.lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>
            {title}
          </title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {scripts.map((script) =>
            <link key={script} rel="preload" href={script} {...{ as: 'script' }} />,
          )}
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          {styles.map((style) =>
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />,
          )}
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />
          {scripts.map((script) => <script key={script} src={script} />)}
          {analytics.googleTrackingId &&
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                  `ga('create','${analytics
                    .googleTrackingId}','auto');ga('send','pageview')`,
              }}
            />}
          {analytics.googleTrackingId &&
            <script
              src="https://www.google-analytics.com/analytics.js"
              async
              defer
            />}
        </body>
      </html>
    );
  }
}
