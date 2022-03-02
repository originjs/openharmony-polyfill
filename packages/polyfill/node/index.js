import * as harmonyFS from './fs';

if (!globalThis.fs) {
  globalThis.harmonyFS = harmonyFS;

  if (!globalThis.process) {
    globalThis.process = require('process');
  }

  if (!globalThis.process.versions) {
    globalThis.process.versions = {};
  }

  if (!globalThis.process.versions.node) {
    globalThis.process.versions.node = '0.0.0';
  }

  globalThis['eval'] = function (functionBody) {
    if ('require' == functionBody) {
      return globalThis['require'];
    }

    return eval(functionBody);
  };

  globalThis['require'] = function (moduleName) {
    if (moduleName == 'fs') {
      return harmonyFS;
    }
    return require(moduleName);
  };
}
