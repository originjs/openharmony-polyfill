English | [简体中文](./README-zh.md)
# OpenHarmony Polyfill
This project is a polyfill that implements a subset of the standard web interface for OpenHarmony, currently includes the following APIs:
* XMLHttpRequest
* fetch
* WebSocket
* Web Storage
* TextDecoder
* TextEncoder
* URL API
* Web Workers

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