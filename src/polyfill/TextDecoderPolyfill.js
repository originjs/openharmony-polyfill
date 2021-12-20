import util from '@ohos.util';

if (util && !globalThis.TextDecoder) {
  globalThis.TextDecoder = util.TextDecoder;
}
