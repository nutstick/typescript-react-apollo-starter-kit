import * as React from 'react';
import { connect } from 'react-redux';
import { ISetLocale, setLocale } from '../../redux/intl/actions';
import { IntlState } from '../../redux/intl/reducers';

namespace LanguageSwitcher {
  export interface IConnectState {
    currentLocale: string;
    availableLocales: string[];
  }

  export interface IConnectDispatch {
    setLocale({ locale: string }): ISetLocale;
  }

  export type Props = IConnectState & IConnectDispatch;
}

const LanguageSwitcher: React.StatelessComponent<LanguageSwitcher.Props>
  = ({ currentLocale, availableLocales, setLocale: setLocale_ }) => {
  const isSelected = (locale) => locale === currentLocale;
  const localeDict = {
    'en-US': 'English',
    'cs-CZ': 'Česky',
  };
  const localeName = (locale) => localeDict[locale] || locale;
  return (
    <div>
      {availableLocales.map((locale) => (
        <span key={locale}>
          {isSelected(locale) ? (
            <span>{localeName(locale)}</span>
          ) : (
            <a
              href={`?lang=${locale}`}
              onClick={(e) => {
                setLocale_({ locale });
                e.preventDefault();
              }}
            >{localeName(locale)}</a>
          )}
          {' '}
        </span>
      ))}
    </div>
  );
};

export default connect((state) => ({
  availableLocales: state.runtime.availableLocales,
  currentLocale: state.intl.locale,
}), {
  setLocale,
})(LanguageSwitcher);
