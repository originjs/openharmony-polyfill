import util from '@ohos.util';

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = util.TextDecoder;
}
