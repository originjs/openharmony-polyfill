import util from '@ohos.util';

export class TextDecoder {

  constructor(encoding, options) {
    encoding = encoding ?? 'utf-8';
    if (!options) {
      options = Object.create(null);
    }
    options.fatal = options.fatal ?? false;
    options.ignoreBOM = options.ignoreBOM ?? false;
    return  new util.TextDecoder(encoding, options);
  }
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}
