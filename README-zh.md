[English](./README.md) | 简体中文
# OpenHarmony Polyfill
提供标准Web接口的Openharmony Polyfill，目前包括如下API：
* ✅ XMLHttpRequest
* ✅ fetch
* ✅ WebSocket
* ✅ TextDecoder
* ✅ TextEncoder
* ✅ URL API
* ⚠️ File System
* ⚠️ Web Storage
* ❌ Web Workers

| 图标 | 描述 |
| ---- | ---- |
|✅|已实现|
|⚠️|部分实现|
|❌|不支持|
## 如何使用？

1. 在鸿蒙应用工程目录运行如下命令安装
```
npm install openharmony-polyfill --save
```
2. 在js入口文件中添加import
```js
import 'openharmony-polyfill'
```
3. 现在你可以在源码中使用标准的Web API接口，例如`XMLHttpRequest`，也可以使用调用了标准Web接口的第三方库，如`axios`
4. 详细使用可参考`examples`中的示例

## 已测试兼容的三方库
* axios - [示例](examples/sdk7-demo/entry/src/main/ets/default/pages/network.ets)
* protobufjs - [示例](examples/sdk7-demo/entry/src/main/ets/default/pages/protobuf.ets)
* @aws-sdk - [示例](examples/sdk7-demo/entry/src/main/ets/default/pages/network.ets)
* autobahn 
* - [示例](examples/sdk7-demo/entry/src/main/ets/default/pages/autobahn.ets)
* - [使用](examples/sdk7-demo/readme.md)