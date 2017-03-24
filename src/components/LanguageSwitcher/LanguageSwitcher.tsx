import * as React from 'react';
import { connect } from 'react-redux';
import { setLocale } from '../../redux/intl/actions';

interface ILanguageSwitcherProps extends React.Props<any> {
  currentLocale: string;
  availableLocales: string[];
  setLocale(state: any): Promise<boolean>;
}

const LanguageSwitcher: React.StatelessComponent<ILanguageSwitcherProps>
  = ({ currentLocale, availableLocales, setLocale }) => {
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
                setLocale({ locale });
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

const mapState = (state) => ({
  availableLocales: state.runtime.availableLocales,
  currentLocale: state.intl.locale,
});

const mapDispatch = {
  setLocale,
};

export default connect(mapState, mapDispatch)(LanguageSwitcher);
