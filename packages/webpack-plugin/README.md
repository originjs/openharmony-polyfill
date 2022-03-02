# openharmony-webpack-plugin
OpenHarmony Polyfill in Webpack.

# Install
```
npm install @originjs/openharmony-webpack-plugin
```
at `{YOUR_SDK_PATH}\Sdk\ets\3.0.0.0\build-tools\ets-loader`
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

## FAQ
### TS2304: Cannot find name 'xx'
If you use these global API directly in `ets`, it may appear an TS2304 error. eg.
```
 ETS:ERROR File: examples\sdk7-demo\entry\src\main\ets\default\pages\textutil.ets:14:29
 TS2304: Cannot find name 'TextDecoder'.
 
 ETS:ERROR File: examples\sdk7-demo\entry\src\main\ets\default\pages\textutil.ets:31:29
 TS2304: Cannot find name 'TextEncoder'.
 
 ETS:ERROR File: examples\sdk7-demo\entry\src\main\ets\default\pages\textutil.ets:45:25
 TS2304: Cannot find name 'URL'.
```

**Solutions：**
Add import statements:
```js
import { TextDecoder } from 'openharmony-polyfill';
import { TextEncoder } from 'openharmony-polyfill';
import { URL } from 'openharmony-polyfill';
```