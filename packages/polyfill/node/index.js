import * as harmonyFS from './fs';
// import * as process from 'process/browser'

if (!globalThis.fs) {
  globalThis.fs = harmonyFS;
}

if (!globalThis.process) {
  globalThis.process = {};
}

if (!globalThis.process.versions) {
  globalThis.process.versions = {};
}

if (!globalThis.process.versions.node) {
  globalThis.process.versions.node = '0.0.0';
}

globalThis['eval'] = function (functionBody) {
  if (functionBody == 'require') {
    return function protoRequire(moduleName) {
      if (moduleName == 'fs') {
        return harmonyFS;
      } else {
        // eslint-disable-next-line
        return __webpack_require__(moduleName);
      }
    };
  }
  return eval(functionBody);
};
