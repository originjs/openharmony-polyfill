import util from '@ohos.util';

export class TextEncoder {

  constructor(encoding) {
    return encoding ? new util.TextEncoder(encoding) : new util.TextEncoder();
  }
}

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}
