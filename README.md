English | [简体中文](./README-zh.md)
# OpenHarmony Polyfill
This project is a polyfill that implements a subset of the standard web interface for OpenHarmony, currently includes the following APIs:
* ✅ XMLHttpRequest
* ✅ fetch
* ✅ WebSocket
* ✅ TextDecoder
* ✅ TextEncoder
* ✅ URL API
* ⚠️ Web Storage
* ❌ Web Workers

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
3. Now you can use the standard Web API interface in the source code, such as `XMLHttpRequest`, or you can use third-party libraries that call the standard Web API, such as `axios`
4. For detailed usage, please refer to the examples in `examples`
   
## Tested Compatible Libraries
* axios - [Example](examples\sdk7-demo\entry\src\main\ets\default\pages\network.ets)
* protobufjs - [Example](examples\sdk7-demo\entry\src\main\ets\default\pages\protobuf.ets)
* @aws-sdk - [Example](examples\sdk7-demo\entry\src\main\ets\default\pages\network.ets)