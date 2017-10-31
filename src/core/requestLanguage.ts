import * as acceptLanguage from 'accept-language';
import * as bcp47 from 'bcp47';

let changeLanguageURL;

function set(props, req, language) {
  if (language) {
    req.language = language;
  } else {
    language = req.language = acceptLanguage.get(req.headers['accept-language']);
  }

  if (typeof props.localizations === 'function') {
    req.localizations = props.localizations(language);
  }
}

export const requestLanguage = (options) => {
  // Check that the language tag is set and that it is an array
  if (typeof options.languages === 'undefined' ||
    Object.prototype.toString.call(options.languages) !== '[object Array]') {
    throw new TypeError('You must define your languages in an array of strings.');
  }

  options.languages.forEach((languageTag) => {
    const language = bcp47.parse(languageTag);
    if (language === null) {
      throw new TypeError('Your language tag \'' + languageTag + '\' is not BCP47 compliant. ' +
        'For more info https://tools.ietf.org/html/bcp47.');
    }
  });

  if (options.cookie) {
    if (typeof options.cookie.name !== 'string' || options.cookie.name.length === 0) {
      throw new TypeError('cookie.name setting must be of type string have a length bigger than zero.');
    }
    if (options.cookie.url) {
      if (!/\{language\}/.test(options.cookie.url)) {
        throw new TypeError('You haven\'t defined the markup `{language}` in your cookie.url settings.');
      }

      if (options.cookie.url.charAt(0) !== '/') {
        options.cookie.url = '/' + options.cookie.url;
      }

      options.cookie.url = '^' + options.cookie.url;

      changeLanguageURL = new RegExp(options.cookie.url
        .replace('/', '\\/')
        .replace('{language}', '(.*)'));
    }
  }

  if (typeof options.localizations !== 'undefined' && typeof options.localizations !== 'function') {
    throw new TypeError('Your \'localizations\' setting is not of type function.');
  }

  acceptLanguage.languages(options.languages);

  return (req, res, next) => {
    let language;
    const queryName = options.queryName || 'language';
    const queryLanguage = req.query[queryName];

    if (typeof queryLanguage === 'string' && queryLanguage.length > 1 &&
      options.languages.indexOf(queryLanguage) !== -1) {
      set(options, req, queryLanguage);
      if (typeof options.cookie !== 'undefined') {
        req.cookies[options.cookie.name] = queryLanguage;
        res.cookie(options.cookie.name, queryLanguage, options.cookie.options);
      }
      return next();
    }

    if (queryLanguage === 'default') {
      res.clearCookie(options.cookie.name);
      req.cookies[options.cookie.name] = undefined;
    }

    if (typeof options.cookie !== 'undefined') {
      if (typeof options.cookie.url === 'string') {
        changeLanguageURL.index = 0;
        const match = changeLanguageURL.exec(req.url);
        if (match !== null) {
          if (options.languages.indexOf(match[1]) !== -1) {
            res.cookie(options.cookie.name, match[1], options.cookie.options);
            return res.redirect('back');
          } else {
            return res.status(404).send('The language is not supported.');
          }
        }
      }

      language = req.cookies[options.cookie.name];
      if (typeof language === 'string') {
        if (options.languages.indexOf(language) !== -1) {
          set(options, req, language);
          return next();
        }
      }
      language = req.cookies[options.cookie.name] = acceptLanguage.get(req.headers['accept-language']);
      res.cookie(options.cookie.name, language, options.cookie.options);
    }

    set(options, req, language);
    next();
  };
};

declare global {
  namespace Express {
    export interface Request {
      language?: string;
      localizations?: any;
    }
  }
}
