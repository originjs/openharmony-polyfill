const { ProvidePlugin } = require('webpack');
const filterObject = require('filter-obj');

const excludeObjectKeys = (object, excludeKeys) =>
  filterObject(object, (key) => !excludeKeys.includes(key));

module.exports = class OpenharmonyPolyfillPlugin {
  constructor(options = {}) {
    this.options = {
      excludeAliases: [],
      ...options
    };
  }

  apply(compiler) {
    compiler.options.plugins.push(
      /**
       * Automatically load modules instead of having to import or require them.
       * @see https://webpack.js.org/plugins/provide-plugin/
       */
      new ProvidePlugin(
        excludeObjectKeys(
          {
            Buffer: [require.resolve('buffer/'), 'Buffer'],
            process: require.resolve('process/browser'),
            crypto: ['openharmony-polyfill/web/crypto', 'crypto'],
            fetch: ['openharmony-polyfill/web/fetch', 'fetch'],
            navigator: ['openharmony-polyfill/web/navigator', 'navigator'],
            XMLHttpRequest: ['openharmony-polyfill/web/xhr', 'XMLHttpRequest'],
            TextDecoder: ['openharmony-polyfill/web/encoding', 'TextDecoder'],
            TextEncoder: ['openharmony-polyfill/web/encoding', 'TextEncoder'],
            URL: ['openharmony-polyfill/web/url', 'URL'],
            URLSearchParams: ['openharmony-polyfill/web/url', 'URLSearchParams']
          },
          this.options.excludeAliases
        )
      )
    );

    /**
     * Redirect module requests when normal resolving fails.
     * @see https://webpack.js.org/configuration/resolve/#resolvefallback
     */
    compiler.options.resolve.fallback = {
      ...excludeObjectKeys(
        {
          // use openharmony polyfill
          fs: require.resolve('openharmony-polyfill/node/fs'),
          // use browserify
          assert: require.resolve('assert/'),
          buffer: require.resolve('buffer/'),
          crypto: require.resolve('crypto-browserify'),
          domain: require.resolve('domain-browser'),
          events: require.resolve('events/'),
          // TODO: rewrite with openharmony http api
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify/browser'),
          path: require.resolve('path-browserify'),
          process: require.resolve('process/browser'),
          querystring: require.resolve('querystring-es3'),
          stream: require.resolve('stream-browserify'),
          string_decoder: require.resolve('string_decoder/'),
          sys: require.resolve('util/'),
          url: require.resolve('url/'),
          util: require.resolve('util/')
        },
        this.options.excludeAliases
      ),
      ...compiler.options.resolve.fallback
    };
  }
};
