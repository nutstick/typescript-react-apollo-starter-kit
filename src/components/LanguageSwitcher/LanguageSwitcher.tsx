import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { LocaleQuery } from '../../apollo/intl/LocaleQuery';
import { SetLocaleMutation } from '../../apollo/intl/SetLocaleMutation';
import * as s from './LanguageSwitcher.css';

namespace LanguageSwitcher {
  // tslint:disable-next-line:interface-over-type-literal
  export type Props = {};
}

@withStyles(s)
export class LanguageSwitcher extends React.Component<LanguageSwitcher.Props> {
  public render() {
    return (
      <LocaleQuery query={LocaleQuery.query}>
        {({ loading, error, data }) => {
          if (loading) { return 'loading'; }
          if (error) { return 'error'; }

          if (data) {
            const { locale, availableLocales } = data;
            const localeDict = {
              /* @intl-code-template '${lang}-${COUNTRY}': '${Name}', */
              'en-US': 'English',
              'th-TH': 'ไทย',
              'cs-CZ': 'Česky',
              /* @intl-code-template-end */
            };
            const localeName = (locale_) => localeDict[locale_] || locale_;

            const isSelected = (locale_) => locale_ === locale;

            return (
              <SetLocaleMutation mutation={SetLocaleMutation.mutation}>
                {(mutate) => {
                  return <div>
                    {availableLocales.map((locale_) =>
                      <span key={locale_}>
                        {isSelected(locale_)
                          ? <span className={s.selected}>
                              {localeName(locale_)}
                            </span>
                          : <a
                              className={s.link}
                              href={`?lang=${locale_}`}
                              onClick={(e) => {
                                mutate({ variables: { locale: locale_ } });
                                e.preventDefault();
                              }}
                            >
                              {localeName(locale_)}
                            </a>}{' '}
                      </span>,
                    )}
                  </div>;
                }}
              </SetLocaleMutation>
            );
          }
        }}
      </LocaleQuery>
    );
  }
}
