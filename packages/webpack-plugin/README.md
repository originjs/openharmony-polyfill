# openharmony-webpack-plugin
OpenHarmony Polyfill in Webpack.

# Install
```
npm install @originjs/openharmony-webpack-plugin
```
## Usage

Add the following to your `webpack.config.js`: (at `{YOUR_SDK_PATH}\Sdk\ets\3.0.0.0\build-tools\ets-loader`)

```js
const OpenHarmonyPolyfillPlugin = require('@originjs/openharmony-webpack-plugin');

module.exports = {
	// Other rules...
	plugins: [
		new OpenHarmonyPolyfillPlugin()
	]
}
```

## API

## Aliases

### Globals

- `Buffer`
- `process`
- `crypto`
- `fetch`
- `XMLHttpRequest`
- `TextDecoder`
- `TextEncoder`
- `URL`
- `URLSearchParams`

### Modules

- `assert`
- `buffer`
- `crypto`
- `domain`
- `events`
- `http`
- `https`
- `os`
- `path`
- `process`
- `querystring`
- `stream`
- `url`
- `util`
- `fs`