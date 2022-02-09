English | [简体中文](./README-zh.md)
# OpenHarmony Polyfill
This project is a polyfill that implements a subset of the standard web interface for OpenHarmony, currently includes the following [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API):
* ✅ [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
* ✅ [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
* ✅ [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
* ✅ [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
* ✅ [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
* ✅ [URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL)
* ⚠️ [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
* ⚠️ [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
* ❌ [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

Node.js API includes：
* ⚠️ [File System](https://nodejs.org/docs/latest-v16.x/api/fs.html#file-system)

| Icon | Description |
| ---- | ---- |
|✅|support|
|⚠️|partial support|
|❌|not support now|

## How to use?

1. Run the following command to install in the OpenHarmony application project directory
```
npm install openharmony-polyfill --save
```
2. Add import in the js entry file
```js
import'openharmony-polyfill'
```
3. Now you can use the standard Web API interface in your source code, such as `XMLHttpRequest`, or you can use third-party libraries that call the standard Web API, such as `axios`
4. For detailed usage, please refer to the examples in `examples`
   
## Tested Compatible Libraries
* axios - [Example](examples/sdk7-demo/entry/src/main/ets/default/pages/network.ets)
* protobufjs - [Example](examples/sdk7-demo/entry/src/main/ets/default/pages/protobuf.ets)
* @aws-sdk - [Example](examples/sdk7-demo/entry/src/main/ets/default/pages/network.ets)
* autobahn 
    * [Example](examples/sdk7-demo/entry/src/main/ets/default/pages/autobahn.ets)
    * [Usage](examples/sdk7-demo/readme.md)
* echarts(only js-sdk) - [Example](examples/sdk7-js-demo/entry/src/main/js/default/pages/echartexamples)