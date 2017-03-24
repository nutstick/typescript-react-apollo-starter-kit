import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import * as s from './Home.css';

export interface INew {
  title: string;
  link: string;
  pubDate: any;
  content?: string;
}

interface IHome extends React.Props<any> {
  news: INew[];
}

class Home extends React.Component<IHome, void> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>React.js News</h1>
          {/*{this.props.news.map((item) => (
            <article key={item.link} className={s.newsItem}>
              <h1 className={s.newsTitle}><a href={item.link}>{item.title}</a></h1>
              {' '}
              <span className={s.publishedDate}>
                <FormattedRelative value={item.pubDate} />
              </span>
              <div
                className={s.newsDesc}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </article>
          ))}*/}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
