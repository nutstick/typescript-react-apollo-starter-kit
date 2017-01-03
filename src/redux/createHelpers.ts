interface IConfig {
  method?: string;
  headers?: {
    [key: string]: string,
  }
  body?: string;
  credentials?: string;
}

function fetch(url, config: IConfig) {
  return new Promise<any> ((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(config.method, url);

    Object.keys(config.headers).forEach((header) => {
      request.setRequestHeader(header, config.headers[header]);
    });
    request.withCredentials = true;

    request.onload = () => {
      if (request.status === 200) {
        return resolve(request.response);
      }
      reject('Unable to load RSS');
    };
    request.onerror = () => {
      reject('Unable to load RSS');
    };
    request.send(config.body);
  });
}

function createGraphqlRequest(fetchKnowingCookie) {
  return async (query, variables) => {
    const fetchConfig = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
    };
    const resp = await fetchKnowingCookie('/graphql', fetchConfig);
    if (resp.status !== 200) {
      throw new Error(resp.statusText);
    }
    return await resp.json();
  };
}

function createFetchKnowingCookie({ cookie }) {
  if (!process.env.BROWSER) {
    return (url, options: IConfig = {}) => {
      const isLocalUrl = /^\/($|[^\/])/.test(url); // eslint-disable-line no-useless-escape

      // pass cookie only for itself.
      // We can't know cookies for other sites BTW
      if (isLocalUrl && options.credentials === 'include') {
        const headers = {
          ...options.headers,
          Cookie: cookie,
        };
        return fetch(url, { ...options, headers });
      }

      return fetch(url, options);
    };
  }

  return fetch;
}

export default function createHelpers(config) {
  const fetchKnowingCookie = createFetchKnowingCookie(config);
  const graphqlRequest = createGraphqlRequest(fetchKnowingCookie);

  return {
    fetch: fetchKnowingCookie,
    graphqlRequest,
    history: config.history,
  };
}
